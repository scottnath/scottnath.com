import PropTypes from "prop-types"
import React from "react"


/**
 * Description list that contains a skillset
 */
const SkillSet = ({ title, skills }) => (
  <dl className="skillset">
    <dt className="subtitle skillset_title">{title}</dt>
    {skills.map((skill, i) => (
      <dd key={i}>{skill.trim()}</dd>
    ))}
  </dl>
)

SkillSet.defaultProps = {
  skills: []
}

SkillSet.propTypes = {
  title: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string)
}

/**
 * Resume section which lists out skillsets with titles
 */
const ResumeSkills = ({ title, skillsets }) => (
  <section className="resume__section resume__tech-skills">
    <h2 className="title resume__section__title">{title}</h2>
    <div className="skills">
      {skillsets.map((skillset, i) => (<SkillSet key={i} {...skillset}/>))}
    </div>
  </section>
)

ResumeSkills.defaultProps = {
  title: 'Technical Skills',
  skillsets: []
}

ResumeSkills.propTypes = {
  title: PropTypes.string,
  skillsets: PropTypes.arrayOf(
    PropTypes.shape(SkillSet.propTypes)
  )
}

export default ResumeSkills
