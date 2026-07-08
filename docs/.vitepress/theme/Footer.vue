<template>
    <footer class="footer">

        <div class="copyright">
            © 2026 丑萌气质狗.
        </div>

        <div class="record">

            <a href="https://beian.miit.gov.cn/" target="_blank">
                皖ICP备 16002969号
            </a>

            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34052302341845" target="_blank">
                <img src="/police-beian.png" class="icon" />
                皖公网安备 34052302341845号
            </a>

        </div>
        <!-- 
        <div class="links">
            <a href="/privacy">隐私政策</a>
            |
            <a href="/about">关于</a>
        </div> -->

    </footer>
</template>

<style scoped>
.footer {
    position: relative;
    z-index: var(--vp-z-index-footer);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--vp-c-gutter);
    padding: 32px 24px;
    background-color: var(--vp-c-bg);
    text-align: center;
}

.copyright,
.record,
.links {
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}

.record {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 16px;
}

.record a,
.links a {
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration-line: underline;
    text-underline-offset: 2px;
    transition: color 0.25s;
}

.record a:hover,
.links a:hover {
    color: var(--vp-c-text-1);
}

.icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    flex: 0 0 auto;
}

.links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

@media (min-width: 768px) {
    .footer {
        padding: 10px;
    }
}
</style>
