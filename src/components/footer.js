import React from 'react';
import PropTypes from 'prop-types';
import { FormattedIcon } from '@components/icons';
import { socialMedia } from '@config';
import styled from 'styled-components';
import { theme, mixins, media } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.footer`
  ${mixins.flexCenter};
  flex-direction: column;
  padding: 15px;
  text-align: center;
  height: auto;
  min-height: 70px;
`;
const StyledSocial = styled.div`
  color: ${colors.lightSlate};
  width: 100%;
  max-width: 270px;
  margin: 0 auto 10px;
  display: none;
  ${media.tablet`display: block;`};
`;
const StyledSocialList = styled.ul`
  ${mixins.flexBetween};
  padding: 0;
  margin: 0;
  list-style: none;
`;
const StyledSocialLink = styled.a`
  padding: 10px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
const StyledMetadata = styled.div`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  line-height: 1;
`;
const StyledGitHubLink = styled.a`
  color: ${colors.lightSlate};
  padding: 10px;
`;

const Footer = () => (
  <StyledContainer>
    <StyledSocial>
      <StyledSocialList>
        {socialMedia &&
          socialMedia.map(({ name, url }, i) => (
            <li key={i}>
              <StyledSocialLink
                href={url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label={name}
              >
                <FormattedIcon name={name} />
              </StyledSocialLink>
            </li>
          ))}
      </StyledSocialList>
    </StyledSocial>
    <StyledMetadata tabindex="-1">
      <StyledGitHubLink
        href="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgifdb.com%2Fimages%2Fhigh%2Ftony-stark-handsome-smirk-f89t34kngar8z3bx.gif&f=1&nofb=1&ipt=c2ed0e409a30e7b07fa5eed32c7f7a10eae3f9394a5050fffc7eca4e14aacf96"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <div
          style={{
            textAlign: 'center',
            marginTop: '120px',
            fontSize: '14px',
            color: '#888',
            letterSpacing: '1px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              background: '#ffd500',
              margin: '20px auto',
              opacity: '0.5',
            }}
          ></div>
          Made with <span style={{ color: '#ffd500', fontWeight: 600 }}>Big D Energy ⚡</span>
          <br />
          <span style={{ fontSize: '12px', color: '#666' }}>© 2026 Yeshwanth Toluva</span>
        </div>
      </StyledGitHubLink>
    </StyledMetadata>
  </StyledContainer>
);

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
