import React, { useEffect, useState } from 'react';

const TributeModal = ({ isOpen, onClose }) => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the popup data
    useEffect(() => {
        const fetchPopup = async () => {
            try {
                const res = await fetch('/api/popup');
                if (res.ok) {
                    const popupData = await res.json();
                    setData(popupData);
                }
            } catch (error) {
                console.error("Failed to fetch popup:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchPopup();
            // Animation timing
            setTimeout(() => setShow(true), 100);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    // Don't render if not open
    if (!isOpen) return null;

    // Don't render while loading or if inactive
    if (loading || !data || !data.isActive) return null;

    // Styles
    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            opacity: show ? 1 : 0,
            transition: 'opacity 0.5s ease',
        },
        container: {
            position: 'relative',
            width: '90%',
            maxWidth: '550px',
            backgroundColor: '#fff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: 'all 0.5s ease',
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            flexDirection: 'column',
        },
        closeBtn: {
            position: 'absolute',
            right: '16px',
            top: '16px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.5)',
            border: 'none',
            borderRadius: '50%',
            padding: '8px',
            cursor: 'pointer',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        headerBg: {
            height: '140px',
            background: 'linear-gradient(to right, #0f172a, #334155)',
            display: data.image && (data.title || data.description) ? 'block' : 'none', // Only if we have both image AND text
        },
        imageWrapper: {
            marginTop: data.image && (data.title || data.description) ? '-70px' : '0',
            display: 'flex',
            justifyContent: 'center',
            padding: !data.title && !data.description ? '0' : undefined, // Full bleed if image only?
        },
        imageContainer: {
            width: data.title || data.description ? '180px' : '100%',
            height: data.title || data.description ? '180px' : 'auto',
            borderRadius: data.title || data.description ? '50%' : '0',
            border: data.title || data.description ? '5px solid white' : 'none',
            overflow: 'hidden',
            boxShadow: data.title || data.description ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            backgroundColor: '#e2e8f0',
            maxHeight: !data.title && !data.description ? '80vh' : undefined, // Max height for image-only
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
        },
        content: {
            padding: '24px 32px 32px',
            textAlign: 'center',
            display: (data.title || data.description) ? 'block' : 'none',
        },
        title: {
            margin: '0 0 12px',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#0f172a',
        },
        message: {
            margin: '0 0 20px',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#334155',
            whiteSpace: 'pre-wrap', // Preserve line breaks
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <button onClick={onClose} style={styles.closeBtn}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                {/* Render Logic */}

                {/* 1. Header BG (only for mixed content) */}
                <div style={styles.headerBg}></div>

                {/* 2. Image */}
                {data.image && (
                    <div style={styles.imageWrapper}>
                        <div style={styles.imageContainer}>
                            <img
                                src={data.image}
                                alt={data.title || "Popup"}
                                style={styles.image}
                            />
                        </div>
                    </div>
                )}

                {/* 3. Text Content */}
                {(data.title || data.description) && (
                    <div style={styles.content}>
                        {data.title && <h2 style={styles.title}>{data.title}</h2>}
                        {data.description && <p style={styles.message}>{data.description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TributeModal;
