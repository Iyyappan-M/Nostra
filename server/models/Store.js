const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Nostra Fashion' },
    email: { type: String, required: true, default: 'contact@nostra.com' },
    phone: { type: String, default: '+1 234 567 890' },
    address: { type: String, default: '123 Fashion Ave, New York, NY 10001' },
    socials: {
        instagram: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        facebook: { type: String, default: '#' }
    },
    openingHours: { type: String, default: 'Mon - Sun: 9:00 AM - 10:00 PM' }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
