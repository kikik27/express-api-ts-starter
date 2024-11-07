import Bull, { Queue, Job } from 'bull';
import { User } from '../db/schema/users';

// Queue names enum
export enum QueueNames {
  EMAIL = 'email',
  NOTIFICATION = 'notification',
  FILE_PROCESSING = 'file-processing',
}

// Queue options interface
interface QueueOptions {
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

// Default options
const defaultOptions: QueueOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  },
  removeOnComplete: true,
  removeOnFail: 5
};

// Queue manager class
class QueueManager {
  private queues: Map<string, Queue> = new Map();
  private readonly redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  };

  // Get or create queue
  getQueue(name: QueueNames, options: QueueOptions = {}): Queue {
    if (!this.queues.has(name)) {
      const queue = new Bull(name, {
        redis: this.redisConfig,
        defaultJobOptions: {
          ...defaultOptions,
          ...options,
        },
      });

      queue.on('error', (error) => {
        console.error(`Queue ${name} error:`, error);
      });

      queue.on('failed', (job, error) => {
        console.error(`Job ${job.id} in queue ${name} failed:`, error);
      });

      queue.on('completed', (job) => {
        console.log(`Job ${job.id} in queue ${name} completed successfully`);
      });

      queue.on('active', (job) => {
        console.log(`Processing job ${job.id} in queue ${name}`);
      });

      queue.on('waiting', (jobId) => {
        console.log(`Job ${jobId} is waiting in queue ${name}`);
      });

      this.queues.set(name, queue);
    }

    return this.queues.get(name)!;
  }

  // Add job to queue with delay
  async addJob<T>(
    queueName: QueueNames,
    data: T,
    options: Bull.JobOptions = {}
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    const delay = options.delay || 5000; // Default 5 second delay
    console.log(`Adding job to queue ${queueName} with ${delay}ms delay`);
    return queue.add(data, { ...options, delay });
  }

  // Process queue jobs
  processQueue<T>(
    queueName: QueueNames,
    processor: (job: Job<T>) => Promise<void>
  ): void {
    const queue = this.getQueue(queueName);
    queue.process(async (job: Job<T>) => {
      try {
        console.log(`Starting to process job ${job.id} in queue ${queueName}`);
        await processor(job);
        console.log(`Successfully processed job ${job.id} in queue ${queueName}`);
      } catch (error) {
        console.error(`Error processing job ${job.id} in queue ${queueName}:`, error);
        throw error;
      }
    });
  }

  async closeAll(): Promise<void> {
    console.log('Closing all queues...');
    const closePromises = Array.from(this.queues.values()).map((queue) =>
      queue.close()
    );
    await Promise.all(closePromises);
    this.queues.clear();
    console.log('All queues closed successfully');
  }

  // Add this new method
  async cleanAllQueues(): Promise<void> {
    console.log('Cleaning all queues...');
    const cleanPromises = Array.from(this.queues.values()).map(async (queue) => {
      await queue.empty();  // Remove all jobs
      await queue.clean(0, 'completed'); // Clean completed jobs
      await queue.clean(0, 'failed');    // Clean failed jobs
      await queue.clean(0, 'wait');      // Clean waiting jobs
      await queue.clean(0, 'delayed');   // Clean delayed jobs
      await queue.clean(0, 'active');    // Clean active jobs
    });
    
    await Promise.all(cleanPromises);
    console.log('All queues cleaned successfully');
  }
}

// Export singleton instance
export const queueManager = new QueueManager();

// Example job interfaces
export interface EmailVerificationJob {
  type: 'verification';
  user: User;
  verificationUrl: string;
}

export interface PasswordResetJob {
  type: 'reset_password';
  user: User;
  resetPasswordUrl: string;
}

export type EmailJob = EmailVerificationJob | PasswordResetJob;
