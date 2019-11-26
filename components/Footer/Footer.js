import React from 'react';
import Link from 'next/link';
import { Container, Header, List } from 'semantic-ui-react';
import UserAdmin from 'components/User/UserAdmin'; // for testing purposes, allows changing of user props
import './Footer.scss';
import slackLogo from 'static/images/logo_slack.png';
import flagImage from 'static/images/flag.jpg';
import DosSeal from 'static/images/dos_seal.svg';

const Footer = () => {
  const menuItems = [
    {
      name: 'home',
      to: '/',
      label: 'Content Commons'
    },
    // {
    //   name: 'developer',
    //   to: '#',
    //   label: 'Developer Tools'
    // },
    {
      name: 'privacy',
      to: '/privacy',
      label: 'Privacy Policy'
    },
    {
      name: 'releasenotes',
      to: '/releasenotes',
      label: 'Release Notes'
    },
    {
      name: 'documentation',
      to: '/documentation',
      label: 'Documentation'
    }
    // {
    //   name: 'tos',
    //   to: 'tos',
    //   label: 'Terms of Service'
    // },
    // {
    //   name: 'sitemap',
    //   to: 'sitemap',
    //   label: 'Sitemap'
    // }
  ];
  return (
    <footer className="ui">
      <UserAdmin />
      <div className="footer-feedback">
        <p>
          Help us improve{ ' ' }
          <Link href="/">
            <a className="footer_link">Content Commons</a>
          </Link>
          . We are looking for&nbsp;
          <a
            href="https://goo.gl/forms/9cJ3IBHH9QTld2Mj2"
            target="_blank"
            className="footer_link"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
          !
        </p>
      </div>
      <Container text className="footer-content">
        <Header as="h1">
          <Header.Subheader className="subtitle">
            Join the conversation on{ ' ' }
            <img src={ slackLogo } alt="Slack" className="footer_img footer_img--slack" />{ ' ' }
            #content-commons
          </Header.Subheader>
        </Header>
        <List horizontal divided className="footer-nav">
          { menuItems.map( item => (
            <List.Item key={ item.name }>
              <Link href={ item.to }>
                <a className="footer_link">{ item.label }</a>
              </Link>
            </List.Item>
          ) ) }
        </List>
        <Header as="h1">
          <Header.Subheader className="subtext">
            Can&apos;t find what you are looking for? To ask questions or provide feedback send us
            an email at <a href="mailto:design@america.gov">design@america.gov</a>.
          </Header.Subheader>
          <Header.Subheader className="smalltext">
            This site is managed by the{ ' ' }
            <a href="https://www.state.gov/bureaus-offices/under-secretary-for-public-diplomacy-and-public-affairs/bureau-of-global-public-affairs/">
              Bureau of Global Public Affairs
            </a>{ ' ' }
            within the <a href="https://state.gov">U.S. Department of State</a>. External links to
            other Internet sites should not be construed as an endorsement of the views or privacy
            policies contained therein. GPA © { new Date().getFullYear() }.
          </Header.Subheader>
        </Header>
        <img src={ flagImage } alt="United States Flag" className="footer_img footer_img--usflag" />
        <img
          src={ DosSeal }
          alt="Department of State Seal"
          className="footer_img footer_img--dosseal"
        />
      </Container>
    </footer>
  );
};

export default Footer;
