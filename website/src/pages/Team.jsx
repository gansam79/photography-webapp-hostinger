import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const Team = () => {
    const [team, setTeam] = useState([]);
    const [teamLoading, setTeamLoading] = useState(true);

    useEffect(() => {
        // Fetch Team
        fetch("/api/team?publicOnly=true")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTeam(data);
            })
            .catch(err => console.error("Error fetching team", err))
            .finally(() => setTeamLoading(false));

        document.body.className = "index-page";

        return () => {
            document.body.className = "";
        };
    }, []);

    return (
        <>
            <Header />

            {/* Page Title */}
            <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/16.webp')" }}>
                <div className="container position-relative">
                    <h1>Our Team</h1>
                    <p>The Creative Souls Capturing Your Story</p>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><a href="/">Home</a></li>
                            <li className="current">Team</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <main className="main">
                {/* Meet Our Team Section */}
                <section id="team" className="team section">
                    <div className="container" data-aos="fade-up">
                        <div className="section-title text-center pb-3 mb-3">
                            <h2>Meet Our Team</h2>
                            <p>Passion, Creativity, and Excellence</p>
                        </div>

                        <div className="row gy-4 justify-content-center">
                            {teamLoading ? (
                                <div className="text-center p-5">Loading team...</div>
                            ) : team?.length > 0 ? (
                                team.map((member) => (
                                    <div key={member._id} className="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay={100}>
                                        <div className="team-member">
                                            <div className="member-img">
                                                <img src={member.image || "/assets/img/logo.PNG"} className="img-fluid" alt={member.name} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                                                <div className="social">
                                                    {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} target="_blank"><i className="bi bi-instagram"></i></a>}
                                                    {member.socialLinks?.facebook && <a href={member.socialLinks.facebook} target="_blank"><i className="bi bi-facebook"></i></a>}
                                                    {member.socialLinks?.website && <a href={member.socialLinks.website} target="_blank"><i className="bi bi-globe"></i></a>}
                                                </div>
                                            </div>
                                            <div className="member-info">
                                                <h4>{member.name}</h4>
                                                <span>{member.role}</span>
                                                <p>{member.bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-5">
                                    <p>Our team is growing! Check back soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
            {/* Scroll Top Button */}
            <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </>
    );
};

export default Team;
