import { queueManager, QueueNames } from '../utils/queue';
import { User } from '../db/schema/users';
import { sendEmailResetPassword, sendEmailVerifyEmail } from '../mailer/mailer.service';

interface EmailVerificationJob {
  type: 'verification';
  user: User;
  verificationUrl: string;
}

interface PasswordResetJob {
  type: 'reset_password';
  user: User;
  resetPasswordUrl: string;
}

type EmailJob = EmailVerificationJob | PasswordResetJob;

// Process email queue
queueManager.processQueue<EmailJob>(QueueNames.EMAIL, async (job) => {
  const { data } = job;

  try {
    switch (data.type) {
      case 'verification':
        await sendEmailVerifyEmail(data.user, { url: data.verificationUrl });
        break;
      case 'reset_password':
        await sendEmailResetPassword(data.user, { url: data.resetPasswordUrl });
        break;
      default:
        throw new Error('Invalid email job type');
    }

    job.progress(100);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}); 