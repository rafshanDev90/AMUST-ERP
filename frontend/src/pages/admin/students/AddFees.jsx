import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

/*
  This page is ONLY for ADMIN
  Route example:
  /admin/students/:id/fees
*/

const StudentFees = () => {
  // student id coming from route
  const { id } = useParams();

  // ----------------------------
  // STATE VARIABLES
  // ----------------------------
  const [fees, setFees] = useState([]);

  // add-fees form states
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  // ----------------------------
  // LOAD ALL FEES OF THIS STUDENT
  // ----------------------------
  const loadFees = async () => {
    try {
      const res = await api.get("/fees");

      // filter fees only for this student
      const studentFees = res.data.filter(
        (fee) => fee.student?._id === id
      );

      setFees(studentFees);
    } catch (error) {
      console.error("Failed to load fees", error);
    }
  };

  useEffect(() => {
    loadFees();
  }, [id]);

  // ----------------------------
  // ADD NEW FEES (ADMIN ONLY)
  // ----------------------------
  const addFees = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/fees", {
        student: id,
        amount: Number(amount),
        dueDate,
        discount: Number(discount),
        note
      });

      // reset form
      setAmount("");
      setDueDate("");
      setDiscount(0);
      setNote("");

      loadFees();
      alert("Fees added successfully");
    } catch (error) {
      alert("Failed to add fees");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // MARK FEES AS PAID
  // ----------------------------
  const markPaid = async (feeId) => {
    try {
      await api.put(`/fees/${feeId}/pay`);
      loadFees();
    } catch (error) {
      alert("Failed to mark paid");
    }
  };

  // ----------------------------
  // LATE FINE CALCULATION
  // Rule: ₹10 per day after due date
  // ----------------------------
  const calculateFine = (fee) => {
    if (fee.paid) return 0;

    const today = new Date();
    const due = new Date(fee.dueDate);

    if (due >= today) return 0;

    const daysLate = Math.ceil(
      (today - due) / (1000 * 60 * 60 * 24)
    );

    return daysLate * 10;
  };

  // ----------------------------
  // SUMMARY CALCULATIONS
  // ----------------------------
  const totalAssigned = fees.reduce(
    (sum, fee) => sum + fee.amount,
    0
  );

  const totalDiscount = fees.reduce(
    (sum, fee) => sum + (fee.discount || 0),
    0
  );

  const totalFine = fees.reduce(
    (sum, fee) => sum + calculateFine(fee),
    0
  );

  const totalPaid = fees
    .filter((fee) => fee.paid)
    .reduce((sum, fee) => sum + fee.amount, 0);

  // FINAL ERP LOGIC
  const netPayable = totalAssigned - totalDiscount + totalFine;
  const remaining = Math.max(netPayable - totalPaid, 0);

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div>
      <h2>Student Fees (Admin Panel)</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div>Total Fees: ₹{totalAssigned}</div>
        <div>Discount: ₹{totalDiscount}</div>
        <div>Fine: ₹{totalFine}</div>
        <div>Paid: ₹{totalPaid}</div>
        <div>
          <strong>Remaining: ₹{remaining}</strong>
        </div>
      </div>

      {/* ===== FEES TABLE ===== */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Fine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee._id}>
              <td>₹{fee.amount}</td>

              <td>{new Date(fee.dueDate).toDateString()}</td>

              <td>
                {fee.paid
                  ? "Paid"
                  : new Date(fee.dueDate) < new Date()
                  ? "Overdue"
                  : "Pending"}
              </td>

              <td>₹{calculateFine(fee)}</td>

              <td>
                {!fee.paid && (
                  <button onClick={() => markPaid(fee._id)}>
                    Mark Paid
                  </button>
                )}

                {"  "}
                <a
                  href={`http://localhost:8080/api/fees/${fee._id}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Invoice
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== ADD FEES FORM ===== */}
      <hr />
      <h3>Add New Fees</h3>

      <form onSubmit={addFees}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Discount / Scholarship"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Fees"}
        </button>
      </form>
    </div>
  );
};

export default StudentFees;
