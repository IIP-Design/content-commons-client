import React from 'react';
import EmailRequest from '../EmailRequest/EmailRequest';

const PasswordResetRequest = () => {
  const email = {
    subject: 'Reset Your Password',
    body: 'Reset your password by using the following link:',
    link: 'Reset your Password',
    reply: 'A reset link has been sent to your email',
    page: 'passwordreset'
  };

  return (
    <EmailRequest
      title="Forgot your password?"
      instructions="Instructions to reset your password will be sent to your email."
      button="Send Password Reset"
      email={ email }
    />
  );
};

export default PasswordResetRequest;
