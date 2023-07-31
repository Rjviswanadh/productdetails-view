import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    displayList: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
    error: '',
  }

  componentDidMount() {
    this.getById()
  }

  getById = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    //  console.log(pathname)
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`

    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()

    const list = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products,
    }
    this.setState({
      displayList: list,
      apiStatus: apiStatusConstants.success,
      // isPresent: true,
    })
    if (data.status_code === 404) {
      console.log(data.error_msg)
      // this.setState(pv => ({isPresent: !pv.isPresent}))
      this.setState(() => ({error: data.error_msg}))
    }
  }

  clickToDelete = () => {
    const {count} = this.state
    if (count === 1) {
      this.setState(() => ({count: 1}))
    } else {
      this.setState(pv => ({count: pv.count - 1}))
    }
  }

  clickToAdd = () => {
    this.setState(pv => ({count: pv.count + 1}))
  }

  itemNotFound = () => {
    const {error} = this.state

    return (
      <>
        <div className="item-not-found">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            className="no-product-img"
            alt="error view"
          />
          <h1>{error}</h1>
          <Link to="/products">
            <button className="shopping" type="button">
              Continue Shopping
            </button>
          </Link>
        </div>
      </>
    )
  }

  productItemsDetails = () => {
    const {displayList, count} = this.state
    console.log(displayList)
    const {
      imageUrl,
      price,
      brand,
      rating,
      description,
      availability,
    } = displayList
    return (
      <>
        <Header />
        <div>
          {displayList.similarProducts !== undefined ? (
            <div>
              <div className="display-size">
                <img src={imageUrl} alt="product" className="display-image" />
                <div>
                  <h1>{brand}</h1>
                  <p>RS {price} /- </p>
                  <div>
                    <div className="bg-color">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                      />
                      <p>{rating}</p>
                    </div>
                  </div>
                  <p>{description}</p>
                  <p>
                    <span className="bold">available</span>:{availability}
                  </p>
                  <p>
                    <span className="bold">Brand</span>: {brand}
                  </p>
                  <hr />
                  <div className="button">
                    <button
                      type="button"
                      onClick={this.clickToDelete}
                      className="button1"
                      testid="minus"
                    >
                      <BsDashSquare />
                    </button>
                    <p>{count}</p>
                    <button
                      type="button"
                      className="button1"
                      onClick={this.clickToAdd}
                      testid="plus"
                    >
                      <BsPlusSquare />
                    </button>
                  </div>
                  <button type="button" className="similar-button">
                    ADD TO CART
                  </button>
                </div>
              </div>
              <div>
                <h1 className="similar-h1">Similar Products</h1>
                <ul className="similar-product">
                  {displayList.similarProducts.map(eachItem => (
                    <SimilarProductItem
                      similarOne={eachItem}
                      key={eachItem.id}
                    />
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>{this.itemNotFound()}</div>
          )}
        </div>
      </>
    )
  }

  failureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure view"
      />
    </>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.productItemsDetails()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
