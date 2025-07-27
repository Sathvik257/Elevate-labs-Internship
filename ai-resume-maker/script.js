// AI Resume Builder - Main JavaScript
class ResumeBuilder {
    constructor() {
        this.currentTemplate = 'modern';
        this.formData = {};
        this.aiSuggestions = {
            summary: [
                "Results-driven software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable web applications and leading cross-functional teams to deliver high-quality solutions.",
                "Experienced project manager with a proven track record of delivering complex projects on time and within budget. Skilled in agile methodologies and team leadership.",
                "Creative marketing professional with expertise in digital marketing, brand strategy, and content creation. Proven ability to increase brand awareness and drive customer engagement."
            ],
            experience: [
                "• Led development of scalable web applications using React, Node.js, and PostgreSQL\n• Managed a team of 5 developers and implemented CI/CD pipelines\n• Improved application performance by 40% through optimization techniques\n• Collaborated with product managers to define and implement new features",
                "• Managed multiple client projects simultaneously with budgets exceeding $500K\n• Implemented agile methodologies resulting in 25% faster project delivery\n• Led cross-functional teams of 8-12 members across different time zones\n• Developed and maintained client relationships, achieving 95% satisfaction rate",
                "• Developed and executed digital marketing campaigns that increased conversion rates by 35%\n• Managed social media presence across multiple platforms with 50K+ followers\n• Created compelling content strategies that improved brand engagement by 60%\n• Analyzed market trends and competitor activities to inform strategic decisions"
            ],
            skills: [
                "JavaScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Git, Agile, Project Management",
                "Project Management, Agile/Scrum, JIRA, Microsoft Project, Risk Management, Team Leadership, Stakeholder Communication",
                "Digital Marketing, Social Media Management, Content Creation, SEO, Google Analytics, Adobe Creative Suite, Email Marketing"
            ],
            projects: [
                "E-commerce Platform - Built a full-stack e-commerce solution using React, Node.js, and MongoDB. Implemented payment processing, inventory management, and admin dashboard. Resulted in 30% increase in online sales.",
                "Task Management App - Developed a collaborative project management tool with real-time updates, file sharing, and team communication features. Used by 500+ users across multiple organizations.",
                "Marketing Analytics Dashboard - Created a comprehensive analytics platform that tracks campaign performance, customer behavior, and ROI. Integrated with multiple marketing tools and social media APIs."
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.showWelcomePage();
        this.populateAllGraduationYears();
    }

    setupEventListeners() {
        // Welcome page navigation
        document.getElementById('create-resume-btn').addEventListener('click', () => this.showResumeBuilder());
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showWelcomePage());
        
        // Preview toggle
        document.getElementById('preview-btn').addEventListener('click', () => this.togglePreview());
        document.getElementById('close-preview').addEventListener('click', () => this.togglePreview());
        
        // Form submission
        document.getElementById('resume-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Save draft
        document.getElementById('save-btn').addEventListener('click', () => this.saveDraft());
        
        // Add section buttons
        document.getElementById('add-experience').addEventListener('click', () => this.addExperience());
        document.getElementById('add-education').addEventListener('click', () => this.addEducation());
        document.getElementById('add-project').addEventListener('click', () => this.addProject());
        
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectTemplate(e));
        });
        
        // AI suggestion buttons
        document.querySelectorAll('.ai-suggest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showAISuggestions(e));
        });
        
        // AI modal events
        document.getElementById('close-ai-modal').addEventListener('click', () => this.closeAIModal());
        document.getElementById('use-suggestion').addEventListener('click', () => this.useAISuggestion());
        document.getElementById('regenerate-suggestion').addEventListener('click', () => this.regenerateSuggestion());
        
        // Form input events for live preview
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.updateProgress();
                this.updateLivePreview();
            });
        });
        
        // Close modal on outside click
        document.getElementById('ai-modal').addEventListener('click', (e) => {
            if (e.target.id === 'ai-modal') {
                this.closeAIModal();
            }
        });

        // AI Review Modal Logic
        const aiReviewBtn = document.getElementById('ai-review-btn');
        const aiReviewModal = document.getElementById('ai-review-modal');
        const closeAIReview = document.getElementById('close-ai-review');
        const aiReviewFeedback = document.getElementById('ai-review-feedback');
        if (aiReviewBtn && aiReviewModal && closeAIReview) {
            aiReviewBtn.addEventListener('click', () => {
                aiReviewModal.style.display = 'flex';
                aiReviewFeedback.textContent = 'Analyzing your resume...';
                setTimeout(() => {
                    aiReviewFeedback.innerHTML = `<ul style='text-align:left;max-width:400px;margin:0 auto;'>
                        <li>✅ <b>Summary</b> is concise and impactful.</li>
                        <li>✅ <b>Experience</b> uses strong action verbs.</li>
                        <li>⚠️ <b>Education</b> section could include more details.</li>
                        <li>💡 Add a "Certifications" section for extra impact.</li>
                    </ul>`;
                }, 1200);
            });
            closeAIReview.addEventListener('click', () => {
                aiReviewModal.style.display = 'none';
            });
        }
    }

    showWelcomePage() {
        document.getElementById('welcome-page').style.display = 'flex';
        document.getElementById('resume-builder-container').style.display = 'none';
    }

    showResumeBuilder() {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('resume-builder-container').style.display = 'flex';
        this.updateProgress();
        this.updateLivePreview();
    }

    togglePreview() {
        const previewPanel = document.getElementById('preview-panel');
        previewPanel.classList.toggle('active');
        
        if (previewPanel.classList.contains('active')) {
            this.updateLivePreview();
        }
    }

    updateProgress() {
        const form = document.getElementById('resume-form');
        const requiredFields = form.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
        const progress = (filledFields.length / requiredFields.length) * 100;
        
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    selectTemplate(e) {
        const template = e.currentTarget.dataset.template;
        
        // Update active template
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        this.currentTemplate = template;
        this.updateLivePreview();
    }

    addExperience() {
        const container = document.getElementById('experience-container');
        const newItem = document.createElement('div');
        newItem.className = 'experience-item';
        newItem.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="this.parentElement.remove(); resumeBuilder.updateProgress();">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" name="jobTitle[]" required>
                </div>
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" name="company[]" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" name="startDate[]">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" name="endDate[]">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description[]" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                <button type="button" class="ai-suggest-btn" data-field="experience">
                    <i class="fas fa-magic"></i>
                    AI Suggest
                </button>
            </div>
        `;
        
        container.appendChild(newItem);
        
        // Add event listeners to new fields
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.updateProgress();
                this.updateLivePreview();
            });
        });
        
        // Add AI suggestion listener
        newItem.querySelector('.ai-suggest-btn').addEventListener('click', (e) => this.showAISuggestions(e));
        
        this.updateProgress();
    }

    populateAllGraduationYears() {
        const start = 1980, end = 2030;
        document.querySelectorAll('select[name="graduationYear[]"]').forEach(select => {
            // Remove all except the first option
            select.innerHTML = '<option value="">Select Year</option>';
            for (let y = end; y >= start; y--) {
                select.innerHTML += `<option value="${y}">${y}</option>`;
            }
        });
    }

    addEducation() {
        const container = document.getElementById('education-container');
        const newItem = document.createElement('div');
        newItem.className = 'education-item';
        newItem.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="this.parentElement.remove(); resumeBuilder.updateProgress();">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-row">
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" name="degree[]" required>
                </div>
                <div class="form-group">
                    <label>Institution *</label>
                    <input type="text" name="institution[]" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Graduation Year</label>
                    <select name="graduationYear[]">
                        <option value="">Select Year</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>GPA</label>
                    <input type="text" name="gpa[]" placeholder="8.5/10.0">
                </div>
            </div>
        `;
        container.appendChild(newItem);
        // Populate years for the new select
        this.populateAllGraduationYears();
        // Add event listeners to new fields
        newItem.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updateProgress();
                this.updateLivePreview();
            });
        });
        this.updateProgress();
    }

    addProject() {
        const container = document.getElementById('projects-container');
        const newItem = document.createElement('div');
        newItem.className = 'project-item';
        newItem.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="this.parentElement.remove(); resumeBuilder.updateProgress();">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-group">
                <label>Project Name *</label>
                <input type="text" name="projectName[]" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="projectDescription[]" rows="3" placeholder="Describe the project, technologies used, and your role..."></textarea>
                <button type="button" class="ai-suggest-btn" data-field="projects">
                    <i class="fas fa-magic"></i>
                    AI Suggest
                </button>
            </div>
            <div class="form-group">
                <label>Project URL</label>
                <input type="url" name="projectUrl[]" placeholder="https://github.com/username/project">
            </div>
        `;
        
        container.appendChild(newItem);
        
        // Add event listeners to new fields
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.updateProgress();
                this.updateLivePreview();
            });
        });
        
        // Add AI suggestion listener
        newItem.querySelector('.ai-suggest-btn').addEventListener('click', (e) => this.showAISuggestions(e));
        
        this.updateProgress();
    }

    showAISuggestions(e) {
        const field = e.target.closest('.ai-suggest-btn').dataset.field;
        const suggestions = this.aiSuggestions[field] || [];
        
        if (suggestions.length === 0) {
            alert('No AI suggestions available for this field.');
            return;
        }
        
        // Store current field for later use
        this.currentAIField = e.target.closest('.form-group').querySelector('input, textarea');
        this.currentAIFieldType = field;
        
        // Show random suggestion
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        this.currentAISuggestion = suggestions[randomIndex];
        
        document.getElementById('ai-suggestions').innerHTML = `
            <div class="ai-suggestion">
                <p>${this.currentAISuggestion}</p>
            </div>
        `;
        
        document.getElementById('ai-modal').classList.add('active');
    }

    closeAIModal() {
        document.getElementById('ai-modal').classList.remove('active');
    }

    useAISuggestion() {
        if (this.currentAIField && this.currentAISuggestion) {
            this.currentAIField.value = this.currentAISuggestion;
            this.currentAIField.dispatchEvent(new Event('input'));
            this.closeAIModal();
        }
    }

    regenerateSuggestion() {
        if (this.currentAIFieldType) {
            const suggestions = this.aiSuggestions[this.currentAIFieldType] || [];
            if (suggestions.length > 1) {
                const currentSuggestion = this.currentAISuggestion;
                let newSuggestion;
                do {
                    newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                } while (newSuggestion === currentSuggestion && suggestions.length > 1);
                
                this.currentAISuggestion = newSuggestion;
                document.getElementById('ai-suggestions').innerHTML = `
                    <div class="ai-suggestion">
                        <p>${this.currentAISuggestion}</p>
                    </div>
                `;
            }
        }
    }

    getFormData() {
        const form = document.getElementById('resume-form');
        const formData = new FormData(form);
        
        // Get basic info
        const data = {
            fullName: formData.get('fullName') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            github: formData.get('github') || '',
            linkedin: formData.get('linkedin') || '',
            summary: formData.get('summary') || '',
            skills: formData.get('skills') || '',
            template: this.currentTemplate
        };
        
        // Get experience
        data.experience = [];
        const jobTitles = formData.getAll('jobTitle[]');
        const companies = formData.getAll('company[]');
        const startDates = formData.getAll('startDate[]');
        const endDates = formData.getAll('endDate[]');
        const descriptions = formData.getAll('description[]');
        
        for (let i = 0; i < jobTitles.length; i++) {
            if (jobTitles[i] && companies[i]) {
                data.experience.push({
                    jobTitle: jobTitles[i],
                    company: companies[i],
                    startDate: startDates[i] || '',
                    endDate: endDates[i] || '',
                    description: descriptions[i] || ''
                });
            }
        }
        
        // Get education
        data.education = [];
        const degrees = formData.getAll('degree[]');
        const institutions = formData.getAll('institution[]');
        const graduationYears = formData.getAll('graduationYear[]');
        const gpas = formData.getAll('gpa[]');
        
        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i] && institutions[i]) {
                data.education.push({
                    degree: degrees[i],
                    institution: institutions[i],
                    graduationYear: graduationYears[i] || '',
                    gpa: gpas[i] || ''
                });
            }
        }
        
        // Get projects
        data.projects = [];
        const projectNames = formData.getAll('projectName[]');
        const projectDescriptions = formData.getAll('projectDescription[]');
        const projectUrls = formData.getAll('projectUrl[]');
        
        for (let i = 0; i < projectNames.length; i++) {
            if (projectNames[i]) {
                data.projects.push({
                    name: projectNames[i],
                    description: projectDescriptions[i] || '',
                    url: projectUrls[i] || ''
                });
            }
        }
        
        return data;
    }

    updateLivePreview() {
        const data = this.getFormData();
        const preview = document.getElementById('resume-content');
        
        // Update template class
        preview.className = `resume-content ${this.currentTemplate}-template`;
        
        // Generate HTML
        preview.innerHTML = this.generateResumeHTML(data);
    }

    generateResumeHTML(data) {
        let html = '';
        
        // Header
        html += `
            <div class="resume-header">
                <h1>${data.fullName || 'Your Name'}</h1>
                <div class="contact-info">
                    ${data.email ? `<div><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.github ? `<div><i class='fab fa-github'></i> <a href='${data.github}' target='_blank'>GitHub</a></div>` : ''}
                    ${data.linkedin ? `<div><i class='fab fa-linkedin'></i> <a href='${data.linkedin}' target='_blank'>LinkedIn</a></div>` : ''}
                </div>
            </div>
        `;
        
        // Summary
        if (data.summary) {
            html += `
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${data.summary}</p>
                </div>
            `;
        }
        
        // Experience
        if (data.experience.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Work Experience</h2>
            `;
            
            data.experience.forEach(exp => {
                html += `
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>${exp.jobTitle}</h3>
                            <span class="company">${exp.company}</span>
                        </div>
                        <div class="experience-dates">
                            ${exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                            ${exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ''}
                        </div>
                        ${exp.description ? `<div class="experience-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        // Education
        if (data.education.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Education</h2>
            `;
            
            data.education.forEach(edu => {
                html += `
                    <div class="education-item">
                        <div class="education-header">
                            <h3>${edu.degree}</h3>
                            <span class="institution">${edu.institution}</span>
                        </div>
                        <div class="education-details">
                            ${edu.graduationYear ? `<span>${edu.graduationYear}</span>` : ''}
                            ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        // Skills
        if (data.skills) {
            html += `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${data.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        // Projects
        if (data.projects.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Projects</h2>
            `;
            
            data.projects.forEach(project => {
                html += `
                    <div class="project-item">
                        <div class="project-header">
                            <h3>${project.name}</h3>
                            ${project.url ? `<a href="${project.url}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                        ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        return html;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const data = this.getFormData();
        
        // Validate required fields
        if (!data.fullName || !data.email || !data.summary) {
            alert('Please fill in all required fields (Name, Email, and Summary).');
            return;
        }
        
        // Show loading
        document.getElementById('loading-overlay').classList.add('active');
        
        try {
            // Update preview
            this.updateLivePreview();
            
            // Generate PDF
            await this.generatePDF();
            
            // Hide loading
            document.getElementById('loading-overlay').classList.remove('active');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            document.getElementById('loading-overlay').classList.remove('active');
            alert('Error generating PDF. Please try again.');
        }
    }

    async generatePDF() {
        const { jsPDF } = window.jspdf;
        const resumeContent = document.getElementById('resume-content');

        // Create canvas
        const canvas = await html2canvas(resumeContent, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Always scale the image to fit exactly one page
        let renderWidth = pdfWidth - 20; // 10mm margin
        let renderHeight = (canvas.height * renderWidth) / canvas.width;
        let x = 10, y = 10;

        // If the content is too tall, scale it down to fit the page height
        if (renderHeight > pdfHeight - 20) {
            renderHeight = pdfHeight - 20;
            renderWidth = (canvas.width * renderHeight) / canvas.height;
            x = (pdfWidth - renderWidth) / 2;
        }

        pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

        const fileName = `${this.getFormData().fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        pdf.save(fileName);

        // Confetti Animation
        this.launchConfetti();
    }

    launchConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        for (let i = 0; i < 80; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.position = 'absolute';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.top = '-4vh';
            conf.style.width = '10px';
            conf.style.height = '18px';
            conf.style.background = `hsl(${Math.random()*360},90%,70%)`;
            conf.style.opacity = 0.85;
            conf.style.borderRadius = '3px';
            conf.style.transform = `rotate(${Math.random()*360}deg)`;
            confettiContainer.appendChild(conf);
            setTimeout(() => {
                conf.style.transition = 'top 2.2s cubic-bezier(.4,0,.2,1), left 1.2s, opacity 0.8s';
                conf.style.top = 100 + Math.random()*10 + 'vh';
                conf.style.left = (parseFloat(conf.style.left) + (Math.random()-0.5)*30) + 'vw';
                conf.style.opacity = 0;
            }, 10);
            setTimeout(() => conf.remove(), 2500);
        }
    }

    saveDraft() {
        const data = this.getFormData();
        localStorage.setItem('resumeDraft', JSON.stringify(data));
        
        // Show success message
        const saveBtn = document.getElementById('save-btn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }

    loadSavedData() {
        const saved = localStorage.getItem('resumeDraft');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.populateForm(data);
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    populateForm(data) {
        // Populate basic fields
        if (data.fullName) document.getElementById('fullName').value = data.fullName;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.phone) document.getElementById('phone').value = data.phone;
        if (data.github) document.getElementById('github').value = data.github;
        if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
        if (data.summary) document.getElementById('summary').value = data.summary;
        if (data.skills) document.getElementById('skills').value = data.skills;
        
        // Set template
        if (data.template) {
            this.currentTemplate = data.template;
            document.querySelectorAll('.template-option').forEach(option => {
                option.classList.remove('active');
                if (option.dataset.template === data.template) {
                    option.classList.add('active');
                }
            });
        }
        
        // Populate experience
        if (data.experience && data.experience.length > 0) {
            // Remove existing experience items except the first one
            const container = document.getElementById('experience-container');
            const items = container.querySelectorAll('.experience-item');
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
            
            // Populate the first item
            if (data.experience[0]) {
                const exp = data.experience[0];
                const inputs = container.querySelectorAll('input, textarea');
                inputs[0].value = exp.jobTitle || '';
                inputs[1].value = exp.company || '';
                inputs[2].value = exp.startDate || '';
                inputs[3].value = exp.endDate || '';
                inputs[4].value = exp.description || '';
            }
            
            // Add additional experience items
            for (let i = 1; i < data.experience.length; i++) {
                this.addExperience();
                const container = document.getElementById('experience-container');
                const items = container.querySelectorAll('.experience-item');
                const currentItem = items[items.length - 1];
                const inputs = currentItem.querySelectorAll('input, textarea');
                const exp = data.experience[i];
                
                inputs[0].value = exp.jobTitle || '';
                inputs[1].value = exp.company || '';
                inputs[2].value = exp.startDate || '';
                inputs[3].value = exp.endDate || '';
                inputs[4].value = exp.description || '';
            }
        }
        
        // Similar logic for education and projects...
        this.updateProgress();
        this.updateLivePreview();
    }
}

// Initialize the resume builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resumeBuilder = new ResumeBuilder();
});

// Add CSS for resume content
const resumeStyles = `
<style>
.resume-content {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #1e293b;
}

.resume-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #3b82f6;
}

.resume-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
}

.contact-info {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: #64748b;
}

.contact-info div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-info a {
    color: #3b82f6;
    text-decoration: none;
}

.resume-section {
    margin-bottom: 2rem;
}

.resume-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
}

.experience-item, .education-item, .project-item {
    margin-bottom: 1.5rem;
}

.experience-header, .education-header, .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.experience-header h3, .education-header h3, .project-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.company, .institution {
    font-weight: 500;
    color: #64748b;
}

.experience-dates, .education-details {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 0.5rem;
}

.experience-description, .project-description {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
}

.skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: #e2e8f0;
    color: #475569;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.project-link {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.9rem;
}

/* Template-specific styles */
.modern-template {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.classic-template {
    background: white;
    border: 2px solid #1e293b;
}

.minimal-template {
    background: white;
    font-family: 'Georgia', serif;
}

.professional-template {
    background: white;
    border-left: 4px solid #3b82f6;
    padding-left: 2rem;
}

@media print {
    .resume-content {
        background: white !important;
        box-shadow: none !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', resumeStyles);

// Animate tagline on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tagline-animate').forEach((el, i) => {
        el.style.animationDelay = (i * 0.7) + 's';
        el.classList.add('animated');
    });
}); 