import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Generate Invoice PDF
export const generateInvoicePDF = (booking) => {
  try {
    console.log('Generating PDF for booking:', booking);
    
    const doc = new jsPDF();
    
    // Header Background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('NearFix', 20, 25);
    
    doc.setFontSize(12);
    doc.text('Service Invoice', 20, 33);
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    
    // Invoice Details
    doc.setFontSize(10);
    const invoiceId = booking._id ? booking._id.slice(-8).toUpperCase() : 'N/A';
    doc.text('Invoice #: ' + invoiceId, 150, 50);
    doc.text('Date: ' + new Date(booking.createdAt).toLocaleDateString('en-IN'), 150, 57);
    doc.text('Status: ' + (booking.status || 'N/A').toUpperCase(), 150, 64);
    
    // Customer Details
    doc.setFontSize(14);
    doc.text('Customer Details', 20, 60);
    
    doc.setFontSize(10);
    const customerName = booking.userId?.name || 'N/A';
    const customerPhone = booking.userId?.phone || 'N/A';
    doc.text('Name: ' + customerName, 20, 70);
    doc.text('Phone: ' + customerPhone, 20, 77);
    
    // Worker Details
    doc.setFontSize(14);
    doc.text('Service Provider', 20, 95);
    
    doc.setFontSize(10);
    const workerName = booking.workerId?.userId?.name || 'N/A';
    const workerPhone = booking.workerId?.userId?.phone || 'N/A';
    doc.text('Name: ' + workerName, 20, 105);
    doc.text('Phone: ' + workerPhone, 20, 112);
    
    // Service Details - Manual Table
    doc.setFontSize(12);
    doc.text('Service Details', 20, 130);
    
    doc.setFontSize(10);
    doc.text('Service: ' + (booking.service || 'N/A'), 20, 145);
    doc.text('Date: ' + new Date(booking.createdAt).toLocaleDateString('en-IN'), 20, 152);
    doc.text('Payment Method: ' + (booking.paymentMethod || 'cash').toUpperCase(), 20, 159);
    
    // Price Box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 170, 170, 20, 'F');
    doc.setFontSize(14);
    doc.text('Total Amount: Rs. ' + (booking.price || 0), 25, 182);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for using NearFix!', 105, 270, null, null, 'center');
    doc.text('For support: support@nearfix.com | +91 1234567890', 105, 275, null, null, 'center');
    
    // Save PDF
    const fileName = 'NearFix_Invoice_' + invoiceId + '.pdf';
    console.log('Saving PDF as:', fileName);
    doc.save(fileName);
    
    console.log('PDF generated successfully');
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    console.error('Error details:', error.message, error.stack);
    throw error;
  }
};

// Export Booking History as CSV
export const exportBookingsToCSV = (bookings) => {
  try {
    const headers = ['Booking ID', 'Service', 'Worker', 'Date', 'Status', 'Price', 'Payment Method'];
    
    const rows = bookings.map(booking => [
      booking._id ? booking._id.slice(-8).toUpperCase() : 'N/A',
      booking.service || 'N/A',
      booking.workerId?.userId?.name || 'N/A',
      new Date(booking.createdAt).toLocaleDateString('en-IN'),
      booking.status ? booking.status.toUpperCase() : 'N/A',
      `₹${booking.price || 0}`,
      booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'CASH'
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `NearFix_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    return true;
  } catch (error) {
    console.error('CSV Export Error:', error);
    throw error;
  }
};

// Export Booking History as JSON
export const exportBookingsToJSON = (bookings) => {
  try {
    const data = bookings.map(booking => ({
      bookingId: booking._id || 'N/A',
      service: booking.service || 'N/A',
      worker: booking.workerId?.userId?.name || 'N/A',
      customer: booking.userId?.name || 'N/A',
      date: booking.createdAt,
      status: booking.status || 'pending',
      price: booking.price || 0,
      paymentMethod: booking.paymentMethod || 'cash',
      rating: booking.rating || null,
      review: booking.review || null
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `NearFix_Bookings_${new Date().toISOString().split('T')[0]}.json`);
    return true;
  } catch (error) {
    console.error('JSON Export Error:', error);
    throw error;
  }
};
