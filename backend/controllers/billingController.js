import Payment from "../models/Payment.js";

export const getBillingData = async (req, res) => {
  try {
    const payments = await Payment.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });
    
    // Calculate dashboard stats
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
    const overdue = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
    
    const stats = [
      { title: "Total Revenue", value: `$ ${totalRevenue.toLocaleString()}`, bg: "bg-blue-600" },
      { title: "Monthly Average", value: (totalRevenue / (payments.length || 1)).toFixed(0), bg: "bg-sky-500" },
      { title: "Pending Payments", value: `$ ${pendingPayments.toLocaleString()}`, bg: "bg-teal-600" },
      { title: "Overdue", value: `$ ${overdue.toLocaleString()}`, bg: "bg-indigo-600" },
    ];

    res.status(200).json({ stats, payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch billing data" });
  }
};