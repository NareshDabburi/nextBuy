import {Helmet} from "react-helmet-async"

const Meta = ({title,description,keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content="{description}"/>
        <meta name="keywords" content="{keywords}"/>
    </Helmet>
  )
}

Meta.defaultsProps = {
    title:"Welcome to NextBuy",
    description:"We sell the best quality products",
    keywords:"electronics,buy electronics,cheap electronics"
}
export default Meta