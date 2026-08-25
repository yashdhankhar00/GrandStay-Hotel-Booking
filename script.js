/* =========================================
   GRANDSTAY WEBSITE JAVASCRIPT
========================================= */


/* =========================================
   ROOM SELECTION
========================================= */

function selectRoom(roomName, price) {

    localStorage.setItem("selectedRoom", roomName);
    localStorage.setItem("selectedPrice", price);

    window.location.href = "booking.html";
}


/* =========================================
   BOOKING PAGE
========================================= */

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const roomSelect = document.getElementById("room");
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");

    const summaryRoom = document.getElementById("summaryRoom");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryNights = document.getElementById("summaryNights");
    const summaryTotal = document.getElementById("summaryTotal");


    /* Set minimum date to today */

    const today = new Date().toISOString().split("T")[0];

    checkin.min = today;
    checkout.min = today;


    /* Get selected room from Rooms page */

    const savedRoom = localStorage.getItem("selectedRoom");
    const savedPrice = localStorage.getItem("selectedPrice");


    if (savedRoom && savedPrice) {

        for (let option of roomSelect.options) {

            if (option.value.startsWith(savedRoom + "|")) {

                option.selected = true;

                break;
            }
        }

    }


    /* Update summary */

    function updateSummary() {

        if (!roomSelect.value) {

            summaryRoom.textContent = "Not selected";
            summaryPrice.textContent = "₹0";

        } else {

            const data = roomSelect.value.split("|");

            const roomName = data[0];
            const price = Number(data[1]);

            summaryRoom.textContent = roomName;
            summaryPrice.textContent =
                "₹" + price.toLocaleString("en-IN");

        }


        let nights = 0;


        if (checkin.value && checkout.value) {

            const start = new Date(checkin.value);
            const end = new Date(checkout.value);

            const difference =
                end.getTime() - start.getTime();

            nights =
                Math.ceil(
                    difference / (1000 * 60 * 60 * 24)
                );

            if (nights < 0) {
                nights = 0;
            }
        }


        summaryNights.textContent = nights;


        if (roomSelect.value && nights > 0) {

            const data = roomSelect.value.split("|");

            const price = Number(data[1]);

            const total = price * nights;

            summaryTotal.textContent =
                "₹" + total.toLocaleString("en-IN");

        } else {

            summaryTotal.textContent = "₹0";

        }

    }


    roomSelect.addEventListener("change", updateSummary);

    checkin.addEventListener("change", function () {

        checkout.min = checkin.value;

        updateSummary();

    });

    checkout.addEventListener("change", updateSummary);


    updateSummary();


    /* =========================================
       CONFIRM BOOKING
    ========================================= */

    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const guestName =
            document.getElementById("guestName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const guests =
            document.getElementById("guests").value;


        if (!roomSelect.value) {

            alert("Please select a room.");

            return;
        }


        if (!checkin.value || !checkout.value) {

            alert("Please select your check-in and check-out dates.");

            return;
        }


        const start = new Date(checkin.value);
        const end = new Date(checkout.value);


        if (end <= start) {

            alert("Check-out date must be after check-in date.");

            return;
        }


        const roomData =
            roomSelect.value.split("|");

        const roomName =
            roomData[0];

        const price =
            Number(roomData[1]);


        const difference =
            end.getTime() - start.getTime();

        const nights =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );


        const total =
            price * nights;


        /* Generate booking ID */

        const randomNumber =
            Math.floor(
                100000 + Math.random() * 900000
            );

        const bookingId =
            "GS-" + randomNumber;


        /* Save booking */

        const booking = {

            bookingId: bookingId,

            guestName: guestName,

            email: email,

            phone: phone,

            room: roomName,

            price: price,

            checkin: checkin.value,

            checkout: checkout.value,

            guests: guests,

            nights: nights,

            total: total

        };


        localStorage.setItem(
            "grandstayBooking",
            JSON.stringify(booking)
        );


        /* Go to confirmation */

        window.location.href =
            "confirmation.html";

    });

}


/* =========================================
   CONFIRMATION PAGE
========================================= */

const bookingData =
    localStorage.getItem("grandstayBooking");


if (
    bookingData &&
    document.getElementById("bookingId")
) {

    const booking =
        JSON.parse(bookingData);


    document.getElementById("bookingId")
        .textContent =
        booking.bookingId;


    document.getElementById("confirmGuest")
        .textContent =
        booking.guestName;


    document.getElementById("confirmRoom")
        .textContent =
        booking.room;


    document.getElementById("confirmCheckin")
        .textContent =
        formatDate(booking.checkin);


    document.getElementById("confirmCheckout")
        .textContent =
        formatDate(booking.checkout);


    document.getElementById("confirmGuests")
        .textContent =
        booking.guests +
        (booking.guests === "1" ? " Guest" : " Guests");


    document.getElementById("confirmTotal")
        .textContent =
        "₹" +
        booking.total.toLocaleString("en-IN");

}


/* =========================================
   DATE FORMATTER
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}