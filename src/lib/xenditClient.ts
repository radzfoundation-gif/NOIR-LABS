/**
 * Xendit Client Helper
 * 
 * Gunakan file ini untuk integrasi Xendit di sisi client (Frontend).
 * HANYA gunakan Public Key di sini. 
 * Secret Key harus digunakan di Backend/Supabase Edge Functions.
 */

const XENDIT_PUBLIC_KEY = import.meta.env.VITE_XENDIT_PUBLIC_KEY;

if (!XENDIT_PUBLIC_KEY) {
    console.warn('Xendit Public Key belum dikonfigurasi di .env');
}

// Contoh fungsi untuk inisialisasi Xendit (jika menggunakan library Xendit JS)
export const initXendit = () => {
    console.log('Initializing Xendit with Public Key:', XENDIT_PUBLIC_KEY);
    // Di sini Anda bisa memuat script Xendit.js jika diperlukan
    // const script = document.createElement('script');
    // script.src = 'https://js.xendit.co/v1/xendit.min.js';
    // document.head.appendChild(script);
};

/**
 * PENTING:
 * Untuk membuat Invoice, Disbursement, atau Recurring Payment,
 * Anda HARUS memanggil API Xendit dari Backend (Supabase Edge Function),
 * bukan langsung dari file ini.
 * 
 * Contoh alur yang benar:
 * Frontend -> Supabase Edge Function (bwaca Secret Key) -> Xendit API
 */
export const createInvoice = async (_amount: number, _externalId: string) => {
    // JANGAN lakukan fetch ke Xendit API langsung dari sini dengan Secret Key.
    // Panggil endpoint backend Anda sebagai gantinya.
    console.error('Create Invoice harus dilakukan di sisi server/backend!');

    // Contoh panggil Supabase Function (jika sudah ada)
    // const { data, error } = await supabase.functions.invoke('create-xendit-invoice', {
    //    body: { amount, externalId }
    // });
    // return data;
};
