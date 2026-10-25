<?php

return [
    'hello' => 'Hello,',
    'hello_name' => 'Hello :name,',
    'contact' => 'For any additional information, please feel free to contact us at <a href="tel::phone_link">:phone</a> or at <a href="mailto::email">:email</a>.',
    'regards' => 'Best regards,',
    'signature' => 'Ti\' Dola Sab',

    'received' => [
        'subject' => 'Tidolasab - Booking in progress',
        'thanks' => 'Thank you for your trust.',
        'processing' => 'Your booking is being processed.',
        'deposit' => 'Your stay will be confirmed upon receipt of your signed contract attached and your deposit of :percent% (:amount €).',
        'full_payment' => 'Your stay will be confirmed upon receipt of your signed contract attached and payment of the full amount of your stay (:amount €), as your arrival is in less than :days days.',
        'balance' => 'The remaining balance will be requested :days days before arrival.',
    ],

    'pending' => [
        'subject' => 'Tidolasab - Booking in progress',
        'thanks' => 'Thank you for your trust.',
        'processing' => 'Your booking is being processed (pending).',
    ],

    'validated' => [
        'subject' => 'Tidolasab - Booking validated!',
        'intro' => 'We are pleased to confirm your booking.',
        'details' => 'Details',
        'people' => 'Number of people:',
        'arrival' => 'Arrival date:',
        'departure' => 'Departure date:',
        'total' => 'Total price:',
        'deposit' => 'Deposit paid:',
        'balance' => 'Balance to be paid:',
        'fully_paid' => 'Your stay is fully paid, thank you!',
        'balance_due' => 'Balance to be paid by :date',
    ],

    'cancelled' => [
        'subject' => 'Tidolasab - Booking cancelled',
        'body' => 'Unfortunately, your booking has just been cancelled.',
    ],

    'reminder' => [
        'subject' => 'Payment reminder for your booking',
        'intro' => 'This is a reminder that your stay begins in :days days.',
        'balance' => 'If you have not yet paid the full amount, please transfer the remaining balance of :amount €.',
        'ignore' => 'If you already have, please disregard this email.',
        'regards' => 'We look forward to welcoming you,',
        'host' => 'Isabelle',
    ],

    'verification' => [
        'subject' => 'Ti\' Dola Sab - Your confirmation code: :code',
        'intro' => 'Here is your code to confirm your booking request at Ti\' Dola Sab:',
        'validity' => 'Enter it on the website to complete your request. It is valid for :minutes minutes.',
        'ignore' => 'If you did not make this request, you can ignore this email.',
    ],
];
