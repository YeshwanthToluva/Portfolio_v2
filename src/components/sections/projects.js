import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { IconExternal } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;
const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  position: relative;
  width: 100%;
  margin-top: 50px;
  ${media.tablet`grid-template-columns: 1fr;`};
`;
const StyledCard = styled.a`
  ${mixins.boxShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  background-color: ${colors.lightNavy};
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};
  &:hover,
  &:focus {
    transform: translateY(-5px);
  }
`;
const StyledCardHeader = styled.div`
  ${mixins.flexBetween};
  width: 100%;
  margin-bottom: 15px;
`;
const StyledIssuer = styled.span`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.green};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;
const StyledExternalIcon = styled.div`
  color: ${colors.lightSlate};
  svg {
    width: 20px;
    height: 20px;
  }
`;
const StyledCardTitle = styled.h4`
  margin: 0 0 10px;
  font-size: ${fontSizes.xxl};
  color: ${colors.lightestSlate};
`;
const StyledCardDescription = styled.div`
  font-size: ${fontSizes.sm};
  color: ${colors.lightSlate};
  a {
    ${mixins.inlineLink};
  }
`;
const StyledCardDate = styled.span`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.slate};
  margin-top: 15px;
`;

const Projects = ({ data }) => {
  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  return (
    <StyledContainer id="certifications" ref={revealContainer}>
      <Heading>Certifications</Heading>

      <StyledGrid>
        {data &&
          data.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, issuer, url, date } = frontmatter;
            return (
              <StyledCard
                key={i}
                href={url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label={title}
              >
                <div>
                  <StyledCardHeader>
                    <StyledIssuer>{issuer}</StyledIssuer>
                    <StyledExternalIcon>
                      <IconExternal />
                    </StyledExternalIcon>
                  </StyledCardHeader>
                  <StyledCardTitle>{title}</StyledCardTitle>
                  <StyledCardDescription dangerouslySetInnerHTML={{ __html: html }} />
                </div>
                <StyledCardDate>{date}</StyledCardDate>
              </StyledCard>
            );
          })}
      </StyledGrid>
    </StyledContainer>
  );
};

Projects.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Projects;
