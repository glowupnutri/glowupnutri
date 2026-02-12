declare namespace JSX {
    interface IntrinsicElements {
        "inpost-geowidget": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                onpoint?: string
                token?: string
                language?: string
                config?: string
            },
            HTMLElement
        >
    }
}
