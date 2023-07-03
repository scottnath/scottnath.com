import PropTypes from "prop-types"
import { marked } from 'marked';

marked.use({
  mangle: false,
  gfm: true,
  headerIds: false,
});

/**
 * @render react
 * @name ResumeExperienceDetails
 * @description Contains summary and description content
 * @example
 * <ResumeExperienceDetails summary="Example summary content is short" description="<h3>may contain HTML</h3>" />
 */
const ResumeExperienceDetails = ({ summary, description, truncatable }) => {
  if (description) {
    const content = marked.parse(description);
    return (
      <details className={truncatable ? 'details truncatable' : 'details'} open>
        <summary className="summary resume__experience__summary">{summary}</summary>
        <div className="description resume__experience__desc" dangerouslySetInnerHTML={{ __html: content }} />
      </details>
    )
  }

  return (<p className={truncatable ? 'summary truncatable' : 'summary'}>{summary}</p>)
}

ResumeExperienceDetails.propTypes = {
  summary: PropTypes.string,
  description: PropTypes.string,
}

export default ResumeExperienceDetails
