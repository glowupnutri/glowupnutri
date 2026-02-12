"use client"

import { useEffect, useRef, useState } from "react"

// Types for InPost GeoWidget
interface InPostPoint {
    name: string
    address: {
        line1: string
        line2: string
    }
    location: {
        latitude: number
        longitude: number
    }
    location_description?: string
    opening_hours?: string
    type: string[]
}

interface InPostMapProps {
    onPointSelect: (point: InPostPoint) => void
    selectedPoint: InPostPoint | null
}

declare global {
    namespace JSX {
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
}

const InPostMap = ({ onPointSelect, selectedPoint }: InPostMapProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const token = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN

    useEffect(() => {
        // Load InPost GeoWidget script
        const existingScript = document.querySelector(
            'script[src*="inpost-geowidget"]'
        )
        const existingLink = document.querySelector(
            'link[href*="inpost-geowidget"]'
        )

        if (!existingLink) {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href =
                "https://geowidget.inpost.pl/inpost-geowidget.css"
            document.head.appendChild(link)
        }

        if (!existingScript) {
            const script = document.createElement("script")
            script.src =
                "https://geowidget.inpost.pl/inpost-geowidget.js"
            script.defer = true
            script.onload = () => {
                setIsLoaded(true)
            }
            document.head.appendChild(script)
        } else {
            setIsLoaded(true)
        }

        // Global callback for InPost GeoWidget
        const handlePointSelect = (event: Event) => {
            const customEvent = event as CustomEvent
            if (customEvent.detail) {
                onPointSelect(customEvent.detail)
            }
        }

        window.addEventListener("inpost-geowidget-point-selected" as any, handlePointSelect as any)

        return () => {
            window.removeEventListener("inpost-geowidget-point-selected" as any, handlePointSelect as any)
        }
    }, [onPointSelect])

    if (!token) {
        return (
            <div className="inpost-error">
                <p>Brak tokenu InPost GeoWidget. Sprawdź konfigurację.</p>
            </div>
        )
    }

    return (
        <div className="inpost-widget-container" ref={containerRef}>
            {/* Selected point info */}
            {selectedPoint && (
                <div className="inpost-selected-point">
                    <div className="inpost-selected-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="inpost-selected-name">{selectedPoint.name}</span>
                    </div>
                    <p className="inpost-selected-address">
                        {selectedPoint.address?.line1}
                        {selectedPoint.address?.line2 && `, ${selectedPoint.address.line2}`}
                    </p>
                    {selectedPoint.location_description && (
                        <p className="inpost-selected-desc">{selectedPoint.location_description}</p>
                    )}
                </div>
            )}

            {/* GeoWidget Map */}
            <div className="inpost-map-wrapper">
                {isLoaded ? (
                    <inpost-geowidget
                        token={token}
                        language="pl"
                        config="parcelCollect"
                    />
                ) : (
                    <div className="inpost-loading">
                        <div className="inpost-spinner" />
                        <p>Ładowanie mapy paczkomatów...</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .inpost-widget-container {
          width: 100%;
          margin-top: 12px;
        }

        .inpost-selected-point {
          background: linear-gradient(135deg, #FFF5F5, #FFFFFF);
          border: 2px solid #E53935;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .inpost-selected-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .inpost-selected-name {
          font-weight: 700;
          font-size: 15px;
          color: #1A1A1A;
        }

        .inpost-selected-address {
          font-size: 13px;
          color: #555;
          margin: 2px 0;
          padding-left: 28px;
        }

        .inpost-selected-desc {
          font-size: 12px;
          color: #888;
          margin: 2px 0;
          padding-left: 28px;
          font-style: italic;
        }

        .inpost-map-wrapper {
          width: 100%;
          height: 450px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #E0E0E0;
          position: relative;
        }

        .inpost-map-wrapper :global(inpost-geowidget) {
          display: block;
          width: 100%;
          height: 100%;
        }

        .inpost-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #FAFAFA;
          gap: 12px;
        }

        .inpost-loading p {
          color: #888;
          font-size: 14px;
        }

        .inpost-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #E0E0E0;
          border-top-color: #E53935;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .inpost-error {
          background: #FFF5F5;
          border: 1px solid #E53935;
          border-radius: 8px;
          padding: 12px;
          color: #C62828;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .inpost-map-wrapper {
            height: 350px;
          }
        }
      `}</style>
        </div>
    )
}

export default InPostMap
