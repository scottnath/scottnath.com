import PropTypes from "prop-types"

const ResumeContact = ({ email, phone, website }) => (
  <nav className="contact-me print-show" role="navigation">
    <ul className="nav">
      <li className="nav-item">
        <a href={`mailto:${email}`} className="nav-link">{email}</a>
      </li>
      <li className="nav-item">
        <a href="`tel:${phone}`" className="nav-link">{phone}</a>
      </li>
      <li className="nav-item">
        <a href="{website}" className="nav-link">{website.replace('https://', '')}</a>
      </li>
    </ul>
  </nav>
)

/**
 * @param {string} title
 */
const ResumeHeader = ({ title, subtitle, summary, email, phone, website }) => (
  <header className="resume__header">
    <h1 className="title resume__title">{ title }</h1>
    <h2 className="subtitle resume__subtitle">{ subtitle }</h2>
    {/* <p className="summary resume__summary">{ summary }</p> */}
    <ResumeContact email={email} phone={phone} website={website} />
  </header>
)

ResumeHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  summary: PropTypes.string,
}

export default ResumeHeader
