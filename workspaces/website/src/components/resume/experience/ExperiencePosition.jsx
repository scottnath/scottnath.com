import PropTypes from "prop-types"

import ExperienceDetails from './ExperienceDetails'
import githubLogo from '~/assets/logos/github.svg'

const ResumeExperienceOrgName = ({ name, classes, github_url }) => {
  if (github_url) {
    return (
      <span className={classes}>{name} 
        <a href={github_url} className="title-link" title="Visit the GitHub repo">
          <img src={githubLogo.src} alt="GitHub logo" />

          <span className="print-show">{github_url.replace('https://', '')}</span>
        </a>
      </span>
    )
  }
  return (
    <span className={classes}>{name}</span>
  )
}

const ResumeExperiencePositionHead = ({ position, org_name, org_parent, parentClasses, orgClasses, timeframe, github_url }) => {
  if (org_parent) {
    return (
      <h3 className="title resume__section__subtitle resume__experience__title">
        <span className={parentClasses}>{org_parent}</span>
        <span className="job-title">{position} @ {org_name}</span>
        <span className="date resume__experience__date">({timeframe})</span>
      </h3>
    )
  }
  return (
    <h3 className="title resume__section__subtitle resume__experience__title">
      <ResumeExperienceOrgName name={org_name} classes={orgClasses} github_url={github_url} />
      <span className="job-title">{position}</span>
        <span className="date resume__experience__date">({timeframe})</span>
    </h3>
  )
}

const ResumeExperiencePosition = (pos) => (
  <section className="position resume__experience__employer">
    <ResumeExperiencePositionHead {...pos} />
    <ExperienceDetails summary={pos.summary} description={pos.description} truncatable={pos.truncatable} />
  </section>
)

ResumeExperiencePosition.propTypes = {
  position: PropTypes.string,
  timeframe: PropTypes.string,
  org_name: PropTypes.string,
  ...ExperienceDetails.propTypes,
}

export default ResumeExperiencePosition
