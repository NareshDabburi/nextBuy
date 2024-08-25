import {LinkContainer} from "react-router-bootstrap";
import{FaTimes} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {useGetOrdersQuery} from '../../slices/orderApiSlices';



const OrderListScreen = () => {
  const {data:orders,isLoading,error}= useGetOrdersQuery();
  console.log(orders);
  return (
    <>
      <div className="theme-heading theme-text-dark-green mt-4 mb-2">Orders</div>
      {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>:(
        // <Table striped hover responsive className="table-sm">
        //   <thead>
        //     <tr>
        //       <th>ID</th>
        //       <th>USER</th>
        //       <th>DATE</th>
        //       <th>TOTAL</th>
        //       <th>PAID</th>
        //       <th>DELIVERED</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {orders.map((order)=>(
        //       <tr key={order._id}>
        //         <td>{order._id}</td>
        //         <td>{order.user && order.user.name}</td>
        //         <td>{order.createdAt && order.createdAt.substring(0,10)}</td>
        //         <td>{order.totalPrice && order.totalPrice}</td>
        //         <td>{order.isPaid ? order.paidAt.substring(0,10): <FaTimes style={{color:'red'}}/>}</td>
        //         <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes style={{color:'red'}}/>}</td>
        //         <td>
        //           <LinkContainer to={`/orders/${order._id}`}>
        //             <Button variant="dark" className="btn-sm">Details</Button>
        //           </LinkContainer>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </Table>

        <table className="table">
          <thead>
            <tr className="theme-text-bold-sm theme-green">
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="theme-text-grey">
            {orders.map((order)=>(
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt && order.createdAt.substring(0,10)}</td>
                <td>{order.totalPrice && order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0,10): <FaTimes style={{color:'red'}}/>}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes style={{color:'red'}}/>}</td>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <button className="theme-btn rounded p-1">Details</button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
export default OrderListScreen