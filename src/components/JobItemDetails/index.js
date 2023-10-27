import {Component} from 'react'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      console.log('API Response Data:', data)
      console.log('Life at Company Data:', data.job_details.life_at_company)
      console.log('skills:', data.job_details.skills)
      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,

        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,

          imageUrl: data.job_details.life_at_company.image_url,
        },

        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
      }
      console.log(updatedJobDetails)

      const updatedSimilarJobs = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      skills,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    console.log('AHG')
    console.log(skills)
    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="logo-title-location-container">
            <div className="logo-title-container">
              <img
                className="company-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />

              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating-heading">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-employee-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location-heading"> {location} </p>
                </div>
                <div className="employee-type-container">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p className="employee-type-heading">{employmentType}</p>
                </div>
              </div>
              <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>

          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <SkillsCard skillsDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-description-image-container">
            <div>
              <p className="life-at-company-description">{description}</p>
            </div>
            <div>
              <img
                src={imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>
        <h1 className="similar-jobs-container">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachSimilarJobs => (
            <SimilarJobItem
              jobDetails={eachSimilarJobs}
              key={eachSimilarJobs.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="failure-view-button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#fffff" height={50} width={50} />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
