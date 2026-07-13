(function () {
  const portfolioContent = window.portfolioContent;

  function buildRightNow() {
    const grid = document.querySelector("[data-rn-grid]");
    if (!grid) return;

    grid.innerHTML = portfolioContent.rightNow
      .map(
        (item) => `<div class="rn-item">
      <div class="rn-item__dot" aria-hidden="true"></div>
      <p class="rn-item__label">${item.label}</p>
      <p class="rn-item__main">${item.main}</p>
      <p class="rn-item__detail">${item.detail}</p>
    </div>`
      )
      .join("");
  }

  function buildOpenChannel() {
    const linksWrap = document.querySelector("[data-open-channel-links]");
    if (!linksWrap) return;

    linksWrap.innerHTML = portfolioContent.openChannelLinks
      .map((item) => {
        const safeLabel = String(item.label || "");
        const safeHref = String(item.href || "#");
        const isExternal = /^https?:\/\//i.test(safeHref);

        return `<a class="open-channel__link" href="${safeHref}"${isExternal ? ' target="_blank" rel="noreferrer noopener"' : ""}>${safeLabel}<span aria-hidden="true"> /</span></a>`;
      })
      .join("");
  }

  function buildNotes() {
    const notesWrap = document.querySelector("[data-notes]");
    if (!notesWrap || !Array.isArray(portfolioContent.notes)) return;

    notesWrap.innerHTML = portfolioContent.notes
      .map(
        (item, index) => `<div class="notes__item">
      <span class="notes__index">${String(index + 1).padStart(2, "0")}</span>
      <p>${item}</p>
    </div>`
      )
      .join("");
  }

  function renderDualityTitle(node, value) {
    if (!node) return;

    const parts = String(value || "")
      .split("\n")
      .map((part) => part.trim())
      .filter(Boolean);

    node.innerHTML = parts
      .map((part, index) => {
        const escaped = part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return index < parts.length - 1 ? `${escaped}<br>` : escaped;
      })
      .join("");
  }

  function buildDuality() {
    const data = portfolioContent.duality;
    if (!data) return;

    const dualityLeftTitle = document.querySelector("[data-duality-left-title]");
    const dualityRightTitle = document.querySelector("[data-duality-right-title]");
    const labelEl = document.querySelector("[data-duality-label]");
    const leftLabelEl = document.querySelector("[data-duality-left-label]");
    const rightLabelEl = document.querySelector("[data-duality-right-label]");
    const leftListEl = document.querySelector("[data-duality-left-list]");
    const rightListEl = document.querySelector("[data-duality-right-list]");

    if (labelEl) labelEl.textContent = data.label;
    if (leftLabelEl) leftLabelEl.textContent = data.leftLabel;
    if (rightLabelEl) rightLabelEl.textContent = data.rightLabel;

    renderDualityTitle(dualityLeftTitle, data.leftTitle);
    renderDualityTitle(dualityRightTitle, data.rightTitle);

    if (leftListEl) {
      leftListEl.innerHTML = data.leftItems
        .map(
          (item) => `<div class="duality__item">
        <span class="duality__item-key">${item.key}</span>
        <span class="duality__item-val">${item.val}</span>
      </div>`
        )
        .join("");
    }

    if (rightListEl) {
      rightListEl.innerHTML = data.rightItems
        .map(
          (item) => `<div class="duality__item">
        <span class="duality__item-key">${item.key}</span>
        <span class="duality__item-val">${item.val}</span>
      </div>`
        )
        .join("");
    }
  }

  function applyContent() {
    const textMap = [
      ["[data-site-name]", portfolioContent.siteName],
      ["[data-nav-intro]", portfolioContent.navIntro],
      ["[data-nav-contact]", portfolioContent.navContact],
      ["[data-intro-label]", portfolioContent.introLabel],
      ["[data-about-label]", portfolioContent.aboutLabel],
      ["[data-intro-lead]", portfolioContent.introLead],
      ["[data-eyebrow]", portfolioContent.eyebrow],
      ["[data-note-primary]", portfolioContent.notePrimary],
      ["[data-note-secondary]", portfolioContent.noteSecondary],
      ["[data-kicker]", portfolioContent.kicker],
      ["[data-location]", portfolioContent.location],
      ["[data-title]", portfolioContent.title],
      ["[data-title-secondary]", portfolioContent.titleSecondary],
      ["[data-description]", portfolioContent.description],
      ["[data-panel-label]", portfolioContent.panelLabel],
      ["[data-panel-title]", portfolioContent.panelTitle],
      ["[data-stamp-number]", portfolioContent.stampNumber],
      ["[data-stamp-text]", portfolioContent.stampText],
      ["[data-cases-label]", portfolioContent.casesLabel],
      ["[data-rightnow-label]", portfolioContent.rightNowLabel],
      ["[data-open-channel-label]", portfolioContent.openChannelLabel],
      ["[data-open-channel-lead]", portfolioContent.openChannelLead],
      ["[data-footer-copyright]", portfolioContent.footerCopyright],
      ["[data-footer-tagline]", portfolioContent.footerTagline],
      ["[data-preloader-label]", portfolioContent.preloaderLabel],
      ["[data-cases-heading]", portfolioContent.casesHeading],
      ["[data-rn-w1]", portfolioContent.rightNowWord1],
      ["[data-rn-w2]", portfolioContent.rightNowWord2],
      ["[data-pv-topbar-label]", portfolioContent.pvTopbarLabel],
      ["[data-pv-close-label]", portfolioContent.pvCloseLabel],
      ["[data-pv-story-label]", portfolioContent.pvStoryLabel],
      ["[data-pv-stack-label]", portfolioContent.pvStackLabel],
      ["[data-pv-details-label]", portfolioContent.pvDetailsLabel],
      ["[data-pv-visuals-label]", portfolioContent.pvVisualsLabel]
    ];

    textMap.forEach(([selector, value]) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    });

    const contactLink = document.querySelector("[data-contact-link]");
    if (contactLink) {
      contactLink.href = portfolioContent.contactHref;
    }

    const primaryCta = document.querySelector("[data-primary-cta]");
    if (primaryCta) {
      primaryCta.textContent = portfolioContent.primaryCtaLabel;
      primaryCta.href = portfolioContent.primaryCtaHref;
    }

    const secondaryCta = document.querySelector("[data-secondary-cta]");
    if (secondaryCta) {
      secondaryCta.textContent = portfolioContent.secondaryCtaLabel;
      secondaryCta.href = portfolioContent.secondaryCtaHref;
    }

    const openChannelEmail = document.querySelector("[data-open-channel-email]");
    if (openChannelEmail) {
      openChannelEmail.textContent = portfolioContent.openChannelEmail;
      openChannelEmail.href = portfolioContent.openChannelEmailHref;
    }

    const panelList = document.querySelector("[data-panel-list]");
    if (panelList) {
      panelList.innerHTML = portfolioContent.panelItems.map((item) => `<li>${item}</li>`).join("");
    }

    buildDuality();
    buildOpenChannel();
    buildNotes();
  }

  window.ContentSections = {
    applyContent,
    buildRightNow
  };
})();
