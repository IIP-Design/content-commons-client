/**
 *
 * PageRegistrationPendingApproval
 *
 */

import React from 'react';
import Link from 'next/link';
import './RegisterPending.scss';

const PageRegistrationPendingApproval = () => (
  <div className="register_pending">
    <h1 className="register_title register_pending_title">Registration: Pending Approval</h1>
    <p className="register_pending_intro">Thank you for registering to Edit and Publish content on the Content Commons!</p>
    <section className="register_pending_section">
      <p className="register_pending_section_header">Your account is now pending approval.</p>
      <p>Once your account is approved you will be notified via email with an activation link where you can finish setting up your account and set a password.</p>
      <p>Please note that the approval process can take between 1-2 business days and logging into your account and uploading content to the Commons will only be accessible after your account is approved and activated.</p>
    </section>
    <section className="register_pending_section">
      <p className="register_pending_section_header">Why do we do this?</p>
      <p>The Content Commons contains many posts, widgets, and files created by the United States Government for official public diplomacy purposes. We need to verify that all editors and admins have the proper credentials for managing content to this USG database. This helps build and retain trust with our audiences and users who rely on this content.</p>
    </section>
    <section className="register_pending_section register_pending_section--links">
      <p className="register_pending_section_header">While you wait:</p>
      <Link to="/">Browse the Content Commons</Link>
      <Link to="/about">Learn more about the Content Commons</Link>
      { /*
            /---- TO DO: CREATE PAGE ----/
          <Link to="#">Learn about the Content Distribution Platform</Link>
          */ }
    </section>
  </div>

);

export default PageRegistrationPendingApproval;
