import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="logo-location-container">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-log"
            />
            <div className="title-rating-container">
              <h1 className="title-heading"> {title} </h1>
              <div className="rating-contaier">
                <BsStarFill className="rating-icon" />
                <p className="rating"> {rating} </p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-empl-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location-heading"> {location} </p>
              </div>
              <div className="emply-type-container">
                <BsFillBriefcaseFill className="brief-case-icon" />
                <p className="emply-type-heading"> {employmentType} </p>
              </div>
            </div>
            <p className="package-heading"> {packagePerAnnum} </p>
          </div>
          <hr className="line" />
          <h1 className="description-heading"> Description </h1>
          <p className="job-description"> {jobDescription} </p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
