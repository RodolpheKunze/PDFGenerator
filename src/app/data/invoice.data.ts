import { DocumentData } from "../interface/template";


export const invoiceData: DocumentData = {
    title: 'via template',
    logoImage: '01-intro-773.jpg',
    company: {
        name: "ACME Corp",
        address: "123 Business St",
        phone: "(555) 555-5555"
    },
    invoice: {
        number: "INV-001",
        date: "2024-12-09"
    },
    items: [
        {
            description: "Widget A",
            quantity: 2,
            rate: 100,
            amount: 200
        },
        {
            description: "Widget B",
            quantity: 1,
            rate: 50,
            amount: 50
        }
    ]
};