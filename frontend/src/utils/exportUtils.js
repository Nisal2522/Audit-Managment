import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import logo from '../assets/auditflow01.png';

export const exportToExcel = (data, fileName) => {
  try {
    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const wscols = Object.keys(data[0]).map(() => ({ wch: 20 }));
    ws['!cols'] = wscols;
    
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
    // Generate Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting to Excel. Please try again.');
  }
};

export const exportToPDF = (data, fileName, columns) => {
  try {
    // Create container
    const element = document.createElement('div');
    element.style.padding = '40px';
    element.style.backgroundColor = '#f8f9fa';
    element.style.fontFamily = 'Arial, sans-serif';

    // Add header section
    const header = document.createElement('div');
    header.style.marginBottom = '30px';
    header.style.textAlign = 'center';
    header.style.padding = '20px';
    header.style.backgroundColor = '#ffffff';
    header.style.borderRadius = '10px';
    header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    // Add logo and title container
    const logoContainer = document.createElement('div');
    logoContainer.style.display = 'flex';
    logoContainer.style.alignItems = 'center';
    logoContainer.style.justifyContent = 'center';
    logoContainer.style.marginBottom = '15px';

    // Add logo
    const logoImg = document.createElement('img');
    logoImg.src = logo; // Use the imported logo
    logoImg.style.width = '40px';
    logoImg.style.height = '40px';
    logoImg.style.marginRight = '10px';

    const logoText = document.createElement('div');
    logoText.textContent = 'AuditFlow';
    logoText.style.fontSize = '28px';
    logoText.style.fontWeight = 'bold';
    logoText.style.color = '#022847';

    logoContainer.appendChild(logoImg);
    logoContainer.appendChild(logoText);
    header.appendChild(logoContainer);

    // Add title
    const title = document.createElement('h2');
    title.textContent = fileName.replace(/_/g, ' ').toUpperCase();
    title.style.fontSize = '20px';
    title.style.color = '#444';
    title.style.margin = '0';
    header.appendChild(title);

    // Add date
    const date = document.createElement('div');
    date.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    date.style.color = '#666';
    date.style.marginTop = '10px';
    header.appendChild(date);

    element.appendChild(header);

    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.style.backgroundColor = '#ffffff';
    tableContainer.style.borderRadius = '10px';
    tableContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    tableContainer.style.overflow = 'auto';
    tableContainer.style.width = '100%';
    tableContainer.style.maxWidth = '100%';

    // Create table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '10px';
    table.style.tableLayout = 'fixed';
    table.style.whiteSpace = 'nowrap';

    // Calculate column widths based on content type
    const columnWidths = {
      'customId': '7%',
      'projectName': '10%',
      'unit': '5%',
      'location': '8%',
      'program': '8%',
      'auditType': '8%',
      'auditorId': '6%',
      'auditorName': '8%',
      'contractDate': '7%',
      'startDate': '7%',
      'endDate': '7%',
      'duration': '5%',
      'offerDays': '5%',
      'manDayCost': '7%',
      'totalCost': '7%'
    };

    // Define all columns that should appear in the PDF
    const defaultColumns = [
      { key: 'customId', header: 'Custom ID' },
      { key: 'projectName', header: 'Project Name' },
      { key: 'unit', header: 'Unit' },
      { key: 'location', header: 'Location' },
      { key: 'program', header: 'Program' },
      { key: 'auditType', header: 'Audit Type' },
      { key: 'auditorId', header: 'Auditor ID' },
      { key: 'auditorName', header: 'Auditor Name' },
      { key: 'contractDate', header: 'Contract Date' },
      { key: 'startDate', header: 'Start Date' },
      { key: 'endDate', header: 'End Date' },
      { key: 'duration', header: 'Duration' },
      { key: 'offerDays', header: 'Offer Days' },
      { key: 'manDayCost', header: 'Man Day Cost' },
      { key: 'totalCost', header: 'Total Cost ($)' }
    ];

    // Use provided columns or default columns
    const finalColumns = columns || defaultColumns;

    // Add header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    finalColumns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.header;
      th.style.backgroundColor = '#022847';
      th.style.color = 'white';
      th.style.padding = '8px 4px';
      th.style.textAlign = 'center';
      th.style.fontWeight = '600';
      th.style.fontSize = '11px';
      th.style.verticalAlign = 'middle';
      th.style.whiteSpace = 'nowrap';
      th.style.width = columnWidths[col.key];
      th.style.overflow = 'hidden';
      th.style.textOverflow = 'ellipsis';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add data rows
    const tbody = document.createElement('tbody');
    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';

      finalColumns.forEach(col => {
        const td = document.createElement('td');
        let value;
        
        // Handle nested properties and format dates
        if (col.key === 'contractDate' || col.key === 'startDate' || col.key === 'endDate') {
          value = item[col.key] ? new Date(item[col.key]).toLocaleDateString() : '';
        } else if (col.key === 'manDayCost') {
          value = item[col.key] ? `$${item[col.key]}` : '';
        } else if (col.key === 'totalCost') {
          value = item[col.key] ? `$${item[col.key]}` : '';
        } else {
          value = item[col.key] || '';
        }
        
        td.textContent = value.toString();
        td.style.padding = '6px 4px';
        td.style.borderBottom = '1px solid #e9ecef';
        td.style.textAlign = 'center';
        td.style.verticalAlign = 'middle';
        td.style.whiteSpace = 'nowrap';
        td.style.overflow = 'hidden';
        td.style.textOverflow = 'ellipsis';
        td.style.width = columnWidths[col.key];
        
        // Add special styling for specific columns
        if (col.header.toLowerCase().includes('status')) {
          const status = value.toString().toLowerCase();
          let statusColor = '#666';
          if (status === 'approved') statusColor = '#28a745';
          if (status === 'pending') statusColor = '#ffc107';
          if (status === 'rejected') statusColor = '#dc3545';
          if (status === 'critical') statusColor = '#dc3545';
          if (status === 'normal') statusColor = '#28a745';
          
          td.style.color = statusColor;
          td.style.fontWeight = '600';
        }

        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    element.appendChild(tableContainer);

    // Add footer
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.textAlign = 'center';
    footer.style.color = '#666';
    footer.style.fontSize = '12px';
    footer.textContent = '© ' + new Date().getFullYear() + ' AuditFlow. All rights reserved.';
    element.appendChild(footer);

    // PDF options
    const opt = {
      margin: [10, 10],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape',
        compress: true
      }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Error exporting to PDF. Please try again.');
  }
}; 