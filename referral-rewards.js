(() => {
    const form = document.getElementById("referral-form");
    if (!form) return;

    const emailInput = document.getElementById("referral-email");
    const submitButton = document.getElementById("referral-submit");
    const submitLabel = document.getElementById("referral-submit-label");
    const spinner = document.getElementById("referral-spinner");
    const status = document.getElementById("referral-status");
    const result = document.getElementById("referral-result");
    const confirmation = document.getElementById("referral-confirmation");
    const codeOutput = document.getElementById("referral-code-output");
    const linkOutput = document.getElementById("referral-link-output");
    const qrContainer = document.getElementById("referral-qr");
    const qrStatus = document.getElementById("referral-qr-status");
    const downloadButton = document.getElementById("referral-download");
    const qrRetryButton = document.getElementById("referral-qr-retry");
    const shareStatus = document.getElementById("referral-share-status");
    const referralCodeInput = form.elements.namedItem("referral_code");
    const referredByInput = form.elements.namedItem("referred_by_code");
    const referrerRewardInput = form.elements.namedItem("referrer_reward_qualified");
    const storageKey = "woodpeckersat-referral-code";
    const codeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const validReferralCode = /^[A-Z0-9-]{1,40}$/;
    let capturedReferralCode = null;
    let submittedReferralUrl = "";
    let isSubmitting = false;

    function normalizeReferralCode(value) {
        if (typeof value !== "string") return null;
        const code = value.trim().toUpperCase();
        return validReferralCode.test(code) ? code : null;
    }

    function saveReferralCode(code) {
        try {
            window.sessionStorage.setItem(storageKey, code);
            return true;
        } catch {
            return false;
        }
    }

    function clearReferralCode() {
        try {
            window.sessionStorage.removeItem(storageKey);
        } catch {
            // Referral attribution remains available in memory for this page.
        }
    }

    function removeReferralFromUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete("ref");
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }

    const queryReferralCode = normalizeReferralCode(new URLSearchParams(window.location.search).get("ref"));
    if (queryReferralCode) {
        capturedReferralCode = queryReferralCode;
        if (saveReferralCode(queryReferralCode)) {
            try {
                removeReferralFromUrl();
            } catch {
                // Keep working with the referral code already captured in memory.
            }
        }
    } else {
        try {
            capturedReferralCode = normalizeReferralCode(window.sessionStorage.getItem(storageKey));
        } catch {
            capturedReferralCode = null;
        }
    }
    referredByInput.value = capturedReferralCode || "none";
    referrerRewardInput.value = capturedReferralCode ? "yes" : "no";
    submitButton.disabled = false;

    function setStatus(element, message, isError = false) {
        element.textContent = message;
        element.classList.toggle("is-error", isError);
        element.setAttribute("role", isError ? "alert" : "status");
    }

    function generateReferralCode() {
        if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
            throw new Error("Secure code generation is unavailable in this browser.");
        }

        const randomBytes = new Uint8Array(16);
        window.crypto.getRandomValues(randomBytes);
        return Array.from(randomBytes, (byte) => codeAlphabet[byte & 31]).join("");
    }

    function createQrImage(url) {
        if (typeof window.QRCode !== "function" || !window.QRCode.CorrectLevel) {
            throw new Error("The QR-code library did not load.");
        }

        const source = document.createElement("div");
        new window.QRCode(source, {
            text: url,
            width: 480,
            height: 480,
            colorDark: "#17483e",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
        });

        const sourceCanvas = source.querySelector("canvas");
        if (!sourceCanvas) {
            throw new Error("This browser could not render the QR code.");
        }

        const outputCanvas = document.createElement("canvas");
        const quietZone = 40;
        outputCanvas.width = sourceCanvas.width + quietZone * 2;
        outputCanvas.height = sourceCanvas.height + quietZone * 2;
        const context = outputCanvas.getContext("2d");
        if (!context) {
            throw new Error("This browser could not prepare the QR-code download.");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
        context.drawImage(sourceCanvas, quietZone, quietZone);
        return outputCanvas.toDataURL("image/png");
    }

    function showQrImage(imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = "QR code for your WoodpeckerSAT referral link";
        qrContainer.textContent = "";
        qrContainer.appendChild(image);
        downloadButton.href = imageUrl;
        downloadButton.hidden = false;
        qrRetryButton.hidden = true;
        setStatus(qrStatus, "Your high-resolution QR code is ready.");
    }

    function showQrCode(url) {
        showQrImage(createQrImage(url));
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                // Try the accessible legacy fallback below.
            }
        }

        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = text;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.left = "-9999px";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        let copied = false;
        try {
            copied = document.execCommand("copy");
        } finally {
            temporaryInput.remove();
        }
        return copied;
    }

    document.getElementById("referral-copy").addEventListener("click", async () => {
        try {
            if (await copyText(submittedReferralUrl)) {
                setStatus(shareStatus, "Referral link copied.");
            } else {
                setStatus(shareStatus, "Could not copy automatically. Select and copy the referral link above.", true);
            }
        } catch {
            setStatus(shareStatus, "Could not copy automatically. Select and copy the referral link above.", true);
        }
    });

    document.getElementById("referral-share").addEventListener("click", async () => {
        if (typeof navigator.share === "function") {
            try {
                await navigator.share({
                    title: "Join WoodpeckerSAT Rewards",
                    text: "Join me on WoodpeckerSAT and practice for the SAT.",
                    url: submittedReferralUrl
                });
                setStatus(shareStatus, "Referral link shared.");
                return;
            } catch (error) {
                if (error && error.name === "AbortError") return;
            }
        }

        try {
            if (await copyText(submittedReferralUrl)) {
                setStatus(shareStatus, "Sharing isn’t available here, so your referral link was copied instead.");
            } else {
                setStatus(shareStatus, "Sharing and copying aren’t available. Select and copy the referral link above.",
                    true);
            }
        } catch {
            setStatus(shareStatus, "Sharing and copying aren’t available. Select and copy the referral link above.",
                true);
        }
    });

    qrRetryButton.addEventListener("click", () => {
        try {
            showQrCode(submittedReferralUrl);
        } catch {
            setStatus(qrStatus, "The QR code still can’t be generated. Your referral link is ready to use.", true);
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSubmitting || !form.reportValidity()) return;

        isSubmitting = true;
        submitButton.disabled = true;
        spinner.hidden = false;
        submitLabel.textContent = "Submitting...";
        form.setAttribute("aria-busy", "true");
        setStatus(status, "Sending your registration securely to Formspree…");

        let referralCode;
        try {
            referralCode = generateReferralCode();
        } catch (error) {
            setStatus(status, error.message, true);
            isSubmitting = false;
            submitButton.disabled = false;
            spinner.hidden = true;
            submitLabel.textContent = "Join & Get Your Referral Link";
            form.setAttribute("aria-busy", "false");
            return;
        }

        submittedReferralUrl = `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`;
        referralCodeInput.value = referralCode;
        referredByInput.value = capturedReferralCode || "none";
        referrerRewardInput.value = capturedReferralCode ? "yes" : "no";

        let qrImageUrl = "";
        try {
            qrImageUrl = createQrImage(submittedReferralUrl);
        } catch {
            qrImageUrl = "";
        }

        try {
            const response = await window.fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            });
            if (!response.ok) {
                throw new Error(`Formspree returned HTTP ${response.status}.`);
            }

            let responseBody;
            try {
                responseBody = await response.json();
            } catch {
                throw new Error("Formspree returned an unreadable response.");
            }
            if (!responseBody || responseBody.ok !== true) {
                throw new Error("Formspree did not confirm the registration.");
            }

            const referredSignup = Boolean(capturedReferralCode);
            codeOutput.textContent = referralCode;
            linkOutput.href = submittedReferralUrl;
            linkOutput.textContent = submittedReferralUrl;
            form.hidden = true;
            result.hidden = false;
            emailInput.value = "";
            clearReferralCode();
            try {
                removeReferralFromUrl();
            } catch {
                // The referral code is still cleared from the active form state.
            }
            capturedReferralCode = null;
            referredByInput.value = "none";
            referrerRewardInput.value = "no";
            setStatus(
                confirmation,
                referredSignup
                    ? "Your signup was confirmed. The person who shared your link is now eligible for the free gift; it is not a gift for you. Your own referral link is ready."
                    : "Your registration was confirmed by Formspree. Share your link to invite friends."
            );

            if (!qrImageUrl) {
                setStatus(qrStatus, "Your registration is confirmed and the link is ready, but the QR-code library did not load.",
                    true);
                qrRetryButton.hidden = false;
            } else {
                try {
                    showQrImage(qrImageUrl);
                } catch {
                    setStatus(qrStatus, "Your registration is confirmed and the link is ready, but the QR code could not be displayed.",
                        true);
                    qrRetryButton.hidden = false;
                }
            }
        } catch (error) {
            const reason = error instanceof TypeError
                ? "The registration could not reach Formspree. Check your connection and try again."
                : `${error.message} Your registration was not confirmed; please try again.`;
            setStatus(status, reason, true);
            submittedReferralUrl = "";
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            spinner.hidden = true;
            submitLabel.textContent = "Join & Get Your Referral Link";
            form.setAttribute("aria-busy", "false");
        }
    });
})();
