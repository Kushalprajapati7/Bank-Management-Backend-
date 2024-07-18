import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { IAccount } from '../interface/accountInterface';
import { ITransaction } from '../interface/transactionInterface';

const generateBankStatementPDF = async (accountId: string, transactions: any[], accounts: any[]): Promise<string> => {
    const fileName = path.join(`${__dirname}`, 'bank_statement.pdf');
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(fileName));

    doc.font('Helvetica').fontSize(18);

    doc.text('Bank Statement', { align: 'center' }).fontSize(12);
    doc.moveDown();

    if (accounts.length > 0) {
        const account = accounts[0];
        doc.text(`Account Number: ${account.accountNumber}`);
        // doc.text(`Account Holder's Name: ${account.Statment.AccountHolderName}`);
        // doc.text(`Account Holder's E-mail: ${account.Statment.AccountHolderEmail}`);
        doc.text(`Account Type: ${account.accountType}`);
        doc.text(`Account ID: ${account._id}`);
        doc.text(`Current Balance: ${account.balance.toFixed(2)}`);
        doc.moveDown();
    }

    const tableHeaders = ['No.', 'Date', 'Type', 'Amount', 'Description', 'Balance'];
    const tableRows = transactions.map((transaction, index) => [
        (index + 1).toString(),
        new Date(transaction.Statment.Transactions.Date).toDateString(),
        transaction.Statment.Transactions.TransactionType,
        transaction.Statment.Transactions.TransactionAmount.toFixed(2),
        transaction.Statment.Transactions.Description,
        transaction.Statment.Transactions.AccountBalanceAfterTransaction.toFixed(2),
    ]);

    const startX = 20;
    let startY = doc.y + 10;

    doc.fillColor('black').fontSize(10).font('Helvetica-Bold');
    tableHeaders.forEach((header, i) => {
        doc.rect(startX + i * 90, startY - 10, 90, 20).stroke();
        doc.text(header, startX + i * 90 + 10, startY);
    });
    startY += 20;

    doc.font('Helvetica').fontSize(10);
    tableRows.forEach((row) => {
        row.forEach((cell, i) => {
            doc.rect(startX + i * 90, startY - 10, 90, 20).stroke();
            doc.text(cell, startX + i * 90 + 10, startY, {
                width: 80,
                height: 20,
                ellipsis: true,
                align: 'left'
            });
        });
        startY += 20;
    });

    doc.end();

    return fileName;
};

export default generateBankStatementPDF;
