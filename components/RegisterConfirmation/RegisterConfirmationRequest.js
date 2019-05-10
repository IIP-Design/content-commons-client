import React from 'react';
import EmailRequest from '../EmailRequest/EmailRequest';

const RegisterConfirmationRequest = () => {
  const email = {
    subject: 'Confirm Your Account',
    body: 'Complete your registration by using the following link:',
    link: 'Complete your Registration',
    reply: 'A confirmation link has been sent to your enail',
    page: 'confirm'
  };

  return (
    <EmailRequest
      title="Send Confirmation"
      instructions="Instructions to confirm your registration will be sent to your email."
      button="Send Confirmation"
      email={ email }
    />
  );
};

export default RegisterConfirmationRequest;
