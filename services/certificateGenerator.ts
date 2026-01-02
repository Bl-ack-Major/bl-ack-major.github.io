
export const generateCertificate = (username: string, date: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;

    if (!ctx) return '';

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#367BF0';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Header
    ctx.fillStyle = '#367BF0';
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 100);

    // Subheader
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText('This certifies that', width / 2, 180);

    // Name
    ctx.fillStyle = '#22c55e'; // Green
    ctx.font = 'bold 60px "Courier New", monospace';
    ctx.fillText(username, width / 2, 260);

    // Achievement
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText('Has successfully completed the', width / 2, 340);
    
    ctx.font = 'bold 30px "Courier New", monospace';
    ctx.fillStyle = '#367BF0';
    ctx.fillText('KALI PORTFOLIO CTF CAMPAIGN', width / 2, 390);

    // Date
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`Issued: ${date}`, width / 2, 500);

    // ID
    ctx.fillStyle = '#555555';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText(`ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, width / 2, 530);

    return canvas.toDataURL('image/png');
};
