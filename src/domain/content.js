// Domain layer - Content models and business logic
class ContentModel {
    constructor() {
        this.siteContent = {
            hero: {
                title: "ChronoSpace AI",
                statement: "AI is blind to reality. We're giving it eyes.",
                description: "Developing temporal-spatial intelligence systems that understand reality through time and space."
            },
            manifesto: {
                lead: "Current AI systems operate in isolation from the temporal and spatial realities that govern our world. They process data without understanding the when and where that gives information meaning.",
                description: "ChronoSpace AI bridges this gap by developing temporal-spatial intelligence systems that understand not just what is happening, but when and where it happens in the context of reality's flow."
            },
            approach: {
                title: "How We Work",
                description: "We approach AI development through the lens of temporal perception and dimensional understanding. Our systems don't just analyze data points—they understand the relationships between events across time and space.",
                keyPoints: [
                    {
                        title: "Temporal Intelligence",
                        description: "Understanding causality and sequence in real-time"
                    },
                    {
                        title: "Spatial Awareness", 
                        description: "Contextualizing information within physical and digital spaces"
                    },
                    {
                        title: "Reality Mapping",
                        description: "Creating dynamic models of how the world actually works"
                    }
                ]
            },
            team: {
                title: "Team",
                description: "Our team combines expertise in AI research, temporal dynamics, and systems engineering to build the next generation of reality-aware intelligence.",
                members: [
                    {
                        role: "Research & Development",
                        description: "Leading research in temporal AI architectures and developing novel approaches to time-aware machine learning systems."
                    },
                    {
                        role: "Engineering",
                        description: "Building scalable infrastructure for processing temporal-spatial data streams and implementing real-time reality mapping systems."
                    },
                    {
                        role: "Applied AI",
                        description: "Translating theoretical breakthroughs into practical applications across industries requiring temporal intelligence."
                    }
                ]
            },
            careers: {
                title: "Join Us",
                description: "We're building the future of AI that understands reality as we do—through time and space. If you're passionate about pushing the boundaries of what artificial intelligence can achieve, we want to hear from you.",
                positions: [
                    {
                        title: "Senior AI Researcher",
                        description: "Lead research into temporal-spatial AI architectures and novel learning paradigms."
                    },
                    {
                        title: "Systems Engineer", 
                        description: "Design and implement scalable infrastructure for real-time temporal data processing."
                    },
                    {
                        title: "Applied AI Engineer",
                        description: "Develop practical applications of temporal intelligence across various domains."
                    }
                ]
            },
            contact: {
                title: "Partner With Us",
                description: "Ready to explore how temporal-spatial intelligence can transform your industry? Let's discuss the possibilities.",
                email: "hello@chronospace.ai"
            }
        };
    }

    getContent(section) {
        return this.siteContent[section] || null;
    }

    getAllContent() {
        return this.siteContent;
    }
}