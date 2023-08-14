/**
 * GitHub Profile component
 * @see https://github.com/basskibo/github-user-repo-card
 */

import PropTypes from "prop-types"
import { GithubCard } from "github-user-repo-card";

const Card = ({ name, cardtype, repository, width, height }) => {
  const classes = `github-card ${cardtype}`;
  return (
    <div className={classes}>
      <GithubCard name="basskibo" type="user" repository="blogtech_dev" widht={300} height={400} />
    </div>
  )
}

Card.propTypes = {
  name: PropTypes.string,
  cardtype: PropTypes.string,
}

Card.defaultProps = {
  name: 'scottnath',
  cardtype: 'user',
  repository: '',
  width: 300,
  height: 400,
}

export default Card

