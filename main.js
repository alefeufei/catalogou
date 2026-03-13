function sendWhatsApp(productName, imageUrl, sizes) {
    const phoneNumber = "5521972406574";
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const fullImageUrl = baseUrl + imageUrl;
    
    const message = `Olá! Tenho interesse na *${productName}*.\n\n` +
                    `*Tamanhos:* ${sizes}\n\n` +
                    `*Foto do produto:* ${fullImageUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}
