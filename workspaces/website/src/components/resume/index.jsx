/**
 * Resume component
 */

import Header from "./header"
import Skills from './skills'
import Experience from './experience'

const Resume = ({ title, subtitle, summary, jobs, projects, skillsets, email, phone, website }) => {

  return (
    <article className="resume with-conic-gradient">
      <Header title={title} subtitle={subtitle} summary={summary} email={email} phone={phone} website={website} />
      <Skills title="Technical Skills" skillsets={skillsets}></Skills>
      <Experience title="Employment History" positions={jobs}></Experience>
      <Experience title="Open Source Projects" positions={projects}></Experience>
    </article>
  )
}

Resume.propTypes = {
  ...Header.propTypes,
  ...Skills.propTypes,
  ...Experience.propTypes,
}

export default Resume

