// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrders } from "../api/jobApi";

export default function OrdersPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [review, setReview] = useState({});
  const [delivery, setDelivery] = useState({});
  const [singleOrder, setSingleOrder] = useState(null);
  const ordersPerPage = 5;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in.");
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        if (orderId) {
          const res = await axios.get(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSingleOrder(res.data);
        } else {
          const res = await fetchOrders(); // ✅ Uses auth headers inside jobApi.js
          setOrders(res.data); // ✅ .data because axios returns response object
        }
      } catch (err) {
        console.error("Order fetch failed:", err);
        toast.error("Failed to load order(s)");
      }
    };

    loadData();
  }, [orderId, token, navigate]);

  useEffect(() => {
    let temp = [...orders];
    if (search) {
      temp = temp.filter(
        (o) =>
          o.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
          o.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
          o.sellerName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) temp = temp.filter((o) => o.status === statusFilter);
    if (ratingFilter)
      temp = temp.filter((o) => o.rating >= parseInt(ratingFilter));
    if (startDate && endDate) {
      temp = temp.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }
    if (sortKey === "date") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortKey === "amount") {
      temp.sort((a, b) => b.price - a.price);
    }
    setFilteredOrders(temp);
    setCurrentPage(1);
  }, [search, statusFilter, ratingFilter, startDate, endDate, sortKey, orders]);

  const refreshOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to refresh orders");
    }
  };

  const handleReviewSubmit = async (orderId) => {
    if (!review[orderId]) return;
    try {
      await axios.put(`/api/orders/${orderId}/complete`, review[orderId], {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review submitted");
      refreshOrders();
    } catch {
      toast.error("Review failed");
    }
  };

  const handleDeliver = async (orderId) => {
    if (!delivery[orderId]) return;
    try {
      await axios.put(`/api/orders/${orderId}/deliver`, delivery[orderId], {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Work delivered");
      refreshOrders();
    } catch {
      toast.error("Delivery failed");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order cancelled");
      refreshOrders();
    } catch {
      toast.error("Cancel failed");
    }
  };

  const exportCSV = () => {
    const csv = [
      "id,jobTitle,buyerName,sellerName,price,status,rating,date",
      ...filteredOrders.map((o) =>
        [
          o._id,
          o.jobTitle,
          o.buyerName,
          o.sellerName,
          o.price,
          o.status,
          o.rating || "",
          o.createdAt,
        ].join(",")
      ),
    ];
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    saveAs(blob, "orders.csv");
  };

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="in progress">In Progress</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="select select-bordered"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">Min Rating</option>
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
        </select>
        <select
          className="select select-bordered"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <input
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn btn-outline" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow border rounded">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Job</th>
              <th>Buyer</th>
              <th>Freelancer</th>
              <th>Price</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((o) => (
              <tr key={o._id}>
                <td>{o.jobTitle}</td>
                <td>{o.buyerName}</td>
                <td>{o.sellerName}</td>
                <td>₹{o.price}</td>
                <td>{o.status}</td>
                <td>{o.rating ? `${o.rating} ⭐` : "N/A"}</td>
                <td>{format(new Date(o.createdAt), "dd/MM/yyyy")}</td>
                <td className="flex flex-col gap-1">
                  {user?._id === o.sellerId?._id &&
                    o.status === "in progress" && (
                      <>
                        <input
                          type="text"
                          className="input input-sm"
                          placeholder="Delivery message"
                          onChange={(e) =>
                            setDelivery({
                              ...delivery,
                              [o._id]: {
                                ...delivery[o._id],
                                deliveryMessage: e.target.value,
                              },
                            })
                          }
                        />
                        <input
                          type="text"
                          className="input input-sm"
                          placeholder="Delivery file/link"
                          onChange={(e) =>
                            setDelivery({
                              ...delivery,
                              [o._id]: {
                                ...delivery[o._id],
                                deliveryFile: e.target.value,
                              },
                            })
                          }
                        />
                        <button
                          onClick={() => handleDeliver(o._id)}
                          className="btn btn-xs btn-success"
                        >
                          Deliver
                        </button>
                      </>
                    )}

                  {user?._id === o.buyerId?._id &&
                    o.status === "delivered" &&
                    !o.rating && (
                      <>
                        <select
                          className="select select-sm"
                          onChange={(e) =>
                            setReview({
                              ...review,
                              [o._id]: {
                                ...review[o._id],
                                rating: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">⭐</option>
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <input
                          className="input input-sm"
                          type="text"
                          placeholder="Comment"
                          onChange={(e) =>
                            setReview({
                              ...review,
                              [o._id]: {
                                ...review[o._id],
                                comment: e.target.value,
                              },
                            })
                          }
                        />
                        <button
                          onClick={() => handleReviewSubmit(o._id)}
                          className="btn btn-xs btn-primary"
                        >
                          Submit
                        </button>
                      </>
                    )}

                  {(user?._id === o.buyerId?._id ||
                    user?._id === o.sellerId?._id) &&
                    o.status === "in progress" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="btn btn-xs btn-error"
                      >
                        Cancel
                      </button>
                    )}

                  {o.deliveryFile && (
                    <a
                      href={o.deliveryFile}
                      className="text-blue-600 underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Delivery
                    </a>
                  )}

                  <button
                    className="btn btn-xs btn-info mt-1"
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              currentPage === i + 1 ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
