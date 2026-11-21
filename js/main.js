(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Highlight the navbar item that matches the visible homepage section
    var $scrollNavSections = $("[data-nav-section]");
    if ($scrollNavSections.length) {
        var navSectionSelectors = {
            "beranda": '.navbar-nav > a.nav-link[href="#beranda"]',
            "stok": '.navbar-nav > a.nav-link[href="#stok"]',
            "jenis-hewan": '.navbar-nav > a.nav-link[href="#jenis-hewan"]',
            "katalog-qurban": '.navbar-nav > a.nav-link[href="#katalog-qurban"]',
            "info-qurban": '.navbar-nav > .dropdown > a.nav-link',
            "kontak": '.navbar-nav > a.nav-link[href="#contact-section"], .navbar-nav > a.nav-link[href="contact.html"]'
        };

        var updateActiveNavLink = function () {
            var scrollMarker = $(window).scrollTop() + ($(".navbar").outerHeight() || 0) + 40;
            var activeSection = "beranda";

            $scrollNavSections.each(function () {
                if ($(this).offset().top <= scrollMarker) {
                    activeSection = $(this).attr("data-nav-section");
                }
            });

            var activeSelector = navSectionSelectors[activeSection];
            var $activeNavLink = activeSelector ? $(activeSelector).first() : $();
            if (!$activeNavLink.length) {
                console.error("No navbar link is mapped for homepage section: " + activeSection);
                return;
            }

            $(".navbar-nav .nav-link").removeClass("active");
            $activeNavLink.addClass("active");
        };

        $(window).on("scroll load resize", updateActiveNavLink);
        updateActiveNavLink();
    }
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Send qurban order details to WhatsApp
    $(".whatsapp-order-form").on("submit", function (event) {
        event.preventDefault();

        var form = this;
        var value = function (name) {
            return form.elements.namedItem(name).value.trim();
        };
        var lines = [
            "Assalamu'alaikum, saya ingin memesan hewan qurban.",
            "",
            "Nama: " + value("nama"),
            "Nomor WhatsApp: " + value("whatsapp"),
            "Pilihan hewan: " + value("hewan"),
            "Jumlah: " + value("jumlah")
        ];

        if (value("email")) lines.push("Email: " + value("email"));
        if (value("tanggal")) lines.push("Tanggal diperlukan: " + value("tanggal"));
        if (value("penyerahan")) lines.push("Cara penyerahan: " + value("penyerahan"));
        if (value("alamat")) lines.push("Alamat pengantaran: " + value("alamat"));
        if (value("catatan")) lines.push("Catatan: " + value("catatan"));

        var whatsappNumber = form.getAttribute("data-whatsapp-number");
        var whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });

    $(".qurban-contact-form").on("submit", function (event) {
        event.preventDefault();

        var form = this;
        var name = form.elements.namedItem("nama").value.trim();
        var email = form.elements.namedItem("email").value.trim();
        var message = form.elements.namedItem("pesan").value.trim();
        var lines = [
            "Assalamu'alaikum, saya ingin bertanya tentang qurban.",
            "",
            "Nama: " + name,
            "Pesan: " + message
        ];

        if (email) lines.push("Email: " + email);

        var whatsappNumber = form.getAttribute("data-whatsapp-number");
        var whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });


    // Stock gallery carousel
    $(".stock-gallery").owlCarousel({
        autoplay: true,
        autoplayTimeout: 2500,
        autoplayHoverPause: true,
        smartSpeed: 600,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Qurban video modal carousel
    var $qurbanVideoCarousel = $(".qurban-video-carousel");
    var $qurbanVideoModal = $("#qurbanVideoModal");
    var qurbanVideoModalIsVisible = false;
    var playActiveQurbanVideo = function () {
        var video = $qurbanVideoCarousel.find(".owl-item.active .qurban-video-player").get(0);
        if (!video) return;

        var playRequest = video.play();
        if (playRequest && typeof playRequest.catch === "function") {
            playRequest.catch(function (error) {
                console.error("Tidak dapat memutar video qurban.", error);
            });
        }
    };

    $qurbanVideoCarousel.find(".qurban-video-player").on("ended", function () {
        $qurbanVideoCarousel.trigger("next.owl.carousel", [500]);
    });

    $qurbanVideoCarousel.on("translate.owl.carousel", function () {
        $(this).find(".qurban-video-player").each(function () {
            this.pause();
        });
    });

    $qurbanVideoCarousel.on("translated.owl.carousel", function () {
        if (qurbanVideoModalIsVisible) playActiveQurbanVideo();
    });

    $qurbanVideoCarousel.owlCarousel({
        items: 1,
        loop: false,
        rewind: false,
        nav: true,
        dots: true,
        smartSpeed: 500,
        touchDrag: true,
        mouseDrag: true,
        navText: [
            '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
            '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
        ]
    });

    $qurbanVideoModal.on("shown.bs.modal", function () {
        qurbanVideoModalIsVisible = true;
        $qurbanVideoCarousel.trigger("refresh.owl.carousel");
        playActiveQurbanVideo();
    });

    $qurbanVideoModal.on("hidden.bs.modal", function () {
        qurbanVideoModalIsVisible = false;
        $qurbanVideoCarousel.find(".qurban-video-player").each(function () {
            this.pause();
            if (this.readyState > 0) this.currentTime = 0;
        });
        $qurbanVideoCarousel.trigger("to.owl.carousel", [0, 0]);
    });

    // Animal stock photo details
    var animalCardDetails = {
        "Domba Jantan": {
            image: "img/domba-beranda.jpg",
            description: "Domba jantan dewasa unggulan yang dipelihara dengan pakan hijauan dan konsentrat bernutrisi tinggi di kandang Ponpes Raudlatul Musthofa. Memiliki postur tubuh tegap, bertanduk kokoh, daging padat dengan perlemakan seimbang, serta telah melewati pemeriksaan kesehatan dan batas usia minimal syariat. Sangat direkomendasikan sebagai pilihan utama untuk ibadah qurban perorangan maupun nadzar."
        },
        "Domba Betina": {
            image: "img/1.jpg",
            description: "Domba betina dewasa dalam kondisi sehat, lincah, dan terawat kebersihan bulunya. Dipastikan tidak dalam kondisi hamil dan telah cukup umur sehingga sah digunakan untuk ibadah qurban maupun aqiqah sesuai tuntunan fiqih, sekaligus menjadi bagian dari stok indukan produktif yang tercatat rapi di kandang pesantren."
        },
        "Domba Cempe (Anak Domba)": {
            image: "img/3.jpg",
            description: "Anakan domba hasil pengembangbiakan mandiri di kandang pesantren yang sedang berada dalam fase pertumbuhan dan perawatan intensif. Kategori ini belum memenuhi batas usia minimal sah qurban (belum poel), sehingga dicatat secara terpisah sebagai transparansi pendataan aset ternak dan regenerasi stok kandang masa depan."
        },
        "Kambing Betina": {
            image: "img/jenis%20hewan.jpg",
            description: "Kambing betina dewasa yang dirawat secara rutin dengan pakan berkualitas sehingga memiliki bobot tubuh ideal dan kondisi fisik prima. Telah memenuhi seluruh kriteria usia serta kesehatan tanpa cacat fisik, menjadikannya opsi yang sah dan ekonomis bagi masyarakat yang hendak menunaikan qurban atau aqiqah."
        },
        "Kambing Jantan": {
            image: "img/kambing-beranda.jpg",
            description: "Kambing jantan pilihan dengan perawakan gagah, nafsu makan tinggi, dan bebas dari cacat fisik maupun penyakit kuku dan mulut. Setiap ekor telah dipastikan cukup umur (poel) dan dirawat khusus menjelang Hari Raya Idul Adha untuk menghasilkan kualitas daging terbaik bagi ibadah qurban perorangan."
        },
        "Anak Kambing": {
            image: "img/anak%20kambing.jpg",
            description: "Anakan kambing yang masih berada dalam tahap penyapihan dan pemantauan tumbuh kembang oleh pengurus kandang. Belum diperjualbelikan sebagai hewan qurban karena belum mencapai umur syar'i, dan ditampilkan di sistem guna memastikan akurasi pencatatan seluruh populasi ternak di lingkungan pondok."
        },
        "Kambing Etawa": {
            image: "img/katalog%20qurban.jpg",
            description: "Kambing ras Etawa unggulan yang dikenal memiliki postur tubuh tinggi besar, telinga panjang menjuntai, serta proporsi daging yang jauh lebih melimpah dibandingkan kambing lokal biasa. Sangat cocok bagi mudhohi (pekurban) yang menginginkan hewan qurban berkelas dengan bobot maksimal dan kondisi fisik terjamin."
        },
        "Sapi Perah": {
            image: "img/sapi2-beranda.jpg",
            description: "Sapi jenis perah (Friesian Holstein) berpostur besar dan tinggi yang mendapatkan perawatan intensif serta pakan bernutrisi di kandang pesantren. Selain tercatat sebagai aset ternak produktif, sapi perah jantan maupun betina tidak produktif yang telah memenuhi syarat umur dan kesehatan juga siap dimanfaatkan untuk qurban kolektif 7 orang."
        },
        "Sapi Simetal": {
            image: "img/sapi-beranda.jpg",
            description: "Sapi pedaging ras unggul dengan ciri khas tubuh sangat besar, berotot tebal, dan persentase karkas daging yang tinggi. Dirawat dengan manajemen penggemukan terukur sehingga menghasilkan bobot maksimal, menjadikannya pilihan favorit untuk ibadah qurban patungan (kolektif 7 orang) maupun keluarga besar."
        },
        "Sapi Jantan": {
            image: "img/2.jpg",
            description: "Sapi jantan dewasa lokal maupun persilangan dengan kondisi fisik gagah, sehat, aktif, dan bebas dari segala cacat yang membatalkan qurban. Telah melewati masa karantina serta pemeriksaan rutin sehingga siap disalurkan untuk memenuhi kebutuhan qurban perorangan maupun kelompok."
        },
        "Sapi Betina": {
            image: "img/sapi%20betina.webp",
            objectPosition: "right center",
            description: "Sapi betina dewasa yang sehat, berbadan gemuk, dan telah dipastikan melalui pemeriksaan pengurus bahwa hewan tidak sedang bunting serta sudah mencapai usia minimal 2 tahun. Sah secara hukum syariat untuk dijadikan hewan qurban kolektif maupun pemenuhan nadzar."
        },
        "Sapi Pedet (Anak Sapi)": {
            image: "img/4.jpg",
            description: "Anakan sapi yang masih membutuhkan perawatan khusus dan asupan nutrisi pertumbuhan di kandang Ponpes Raudlatul Musthofa. Kategori ini belum masuk kriteria umur hewan qurban dan didata secara khusus dalam sistem informasi kandang untuk memantau perkembangan populasi ternak pesantren."
        }
    };
    var $animalCards = $(".stock-category-grid .service-item");
    var $animalDetailModal = $("#animalDetailModal");

    if ($animalCards.length && !$animalDetailModal.length) {
        console.error("The animal detail modal is missing from the stock page.");
    }

    $animalCards.each(function () {
        var $card = $(this);
        var title = $card.find("h5").first().text().trim();
        var details = animalCardDetails[title];
        var $icon = $card.find("i.fa-3x").first();

        if (!details || !$icon.length) {
            console.error("Animal photo details are missing for stock card: " + title);
            return;
        }

        var $photoButton = $('<button type="button" class="stock-animal-photo"></button>');
        $photoButton.attr({
            "data-bs-toggle": "modal",
            "data-bs-target": "#animalDetailModal",
            "data-animal-title": title,
            "data-animal-description": details.description,
            "data-animal-image": details.image,
            "data-animal-stock": $card.find("strong").first().text().trim(),
            "aria-label": "Lihat foto dan detail " + title
        });
        var $photoImage = $("<img>", {
            src: details.image,
            alt: "",
            loading: "lazy"
        });
        if (details.objectPosition) {
            $photoImage.css("object-position", details.objectPosition);
        }
        $photoButton.append($photoImage);
        $photoButton.append('<span class="stock-animal-photo-action" aria-hidden="true"><i class="fa fa-search-plus"></i></span>');

        $icon.remove();
        $card.removeClass("pt-3").addClass("stock-animal-card pt-0").prepend($photoButton);
    });

    var enableCardTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (enableCardTilt) {
        $animalCards.on("pointermove", function (event) {
            var bounds = this.getBoundingClientRect();
            var x = (event.clientX - bounds.left) / bounds.width;
            var y = (event.clientY - bounds.top) / bounds.height;
            var rotateX = ((0.5 - y) * 5).toFixed(2);
            var rotateY = ((x - 0.5) * 5).toFixed(2);

            this.style.transform = "perspective(1000px) translateY(-4px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
            this.classList.add("is-pointer-near");
        }).on("pointerleave", function () {
            this.style.transform = "";
            this.classList.remove("is-pointer-near");
        });
    }

    $animalDetailModal.on("show.bs.modal", function (event) {
        var trigger = event.relatedTarget;
        var title = trigger && trigger.getAttribute("data-animal-title");
        var image = trigger && trigger.getAttribute("data-animal-image");
        var description = trigger && trigger.getAttribute("data-animal-description");
        var stock = trigger && trigger.getAttribute("data-animal-stock");

        if (!title || !image || !description || !stock) {
            console.error("Animal detail modal was opened without complete animal data.");
            return;
        }

        $("#animalDetailTitle").text(title);
        $("#animalDetailImage").attr({
            src: image,
            alt: "Foto " + title
        });
        $("#animalDetailDescription").text(description);
        $("#animalDetailStock").text(stock);
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

