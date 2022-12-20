import './index.css'

const SimilarProductItem = props => {
  const {similarOne} = props
  const {
    image_url: imageUrl,
    total_reviews: totalReviews,
    title,
    brand,
    price,
    rating,
  } = similarOne
  console.log(similarOne)

  return (
    <li className="similar-products">
      <img src={imageUrl} alt="similar product" className="similar-img" />
      <h1 className="para">{title}</h1>
      <p> by {brand}</p>
      <p>{totalReviews}</p>
      <div>
        <p>Rs {price}</p>
        <p>{rating}</p>
      </div>
    </li>
  )
}
export default SimilarProductItem
