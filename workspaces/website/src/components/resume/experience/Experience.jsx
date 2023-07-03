import PropTypes from "prop-types"
import React from "react"

import ExperiencePosition from './ExperiencePosition'

const ResumeExperience = ({ title, positions }) => {
  let lastOrg;
  let parentOrg;

  return (
    <section className="experience resume__section resume__experience">
      <h2 className="title resume__section__title">{title}</h2>
      <div className="positions">
        {positions.map((position, i) => {
          position.orgClasses = 'org'
          position.parentClasses = 'parent';
          if (lastOrg === position.org_name) {
            position.orgClasses = 'org hide';
          }
          if (parentOrg === position.org_parent) {
            position.parentClasses = 'parent hide';
          }
          lastOrg = position.org_name;
          parentOrg = position.org_parent;

          return (
            <ExperiencePosition key={i} {...position}/>
          )
        })}
      </div>
    </section>
  )
}

ResumeExperience.defaultProps = {
  title: 'Employment History',
  positions: [],
}

ResumeExperience.propTypes = {
  title: PropTypes.string,
  positions: PropTypes.arrayOf(PropTypes.shape(ExperiencePosition.propTypes)),
}

export default ResumeExperience
