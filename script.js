
        // Global variables
        let postCount = 0;
        const postCountElement = document.getElementById('post-count');
        const emptyFeed = document.getElementById('empty-feed');
        const instagramGrid = document.getElementById('instagram-grid');
        let posts = {}; // Object to store posts by month
        let currentViewingPostIndex = -1; // Index of the post currently being viewed
        let currentViewingMonth = "January"; // Current month being viewed
        
        // Initialize posts object with all months
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        months.forEach(month => {
            posts[month] = [];
        });
        
        // Document ready function
        document.addEventListener('DOMContentLoaded', function() {
            // Set the current month in the post month select dropdown
            document.getElementById('postMonthSelect').value = currentViewingMonth;
            
            // Add sample posts for testing
            addSamplePosts();
        });
        
        // Function to add sample posts
        function addSamplePosts() {
            // Sample post for January
            createNewPost(
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f06292'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EJanuary Post%3C/text%3E%3C/svg%3E",
                "This is my January post! #newyear #january",
                "January"
            );
            
            // Sample post for February
            createNewPost(
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%239c27b0'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFebruary Post%3C/text%3E%3C/svg%3E",
                "Valentine's day is coming! #february #love",
                "February"
            );
        }
        
        // Month selector dropdown
        const monthSelector = document.getElementById('monthSelector');
        const monthDropdown = document.getElementById('monthDropdown');
        const currentMonth = document.getElementById('currentMonth');

        monthSelector.addEventListener('click', () => {
            monthDropdown.classList.toggle('hidden');
        });

        document.querySelectorAll('.month-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedMonth = option.dataset.month;
                currentMonth.textContent = selectedMonth;
                monthDropdown.classList.add('hidden');
                
                // Update the current viewing month
                currentViewingMonth = selectedMonth;
                
                // Refresh the grid with the new month's posts
                refreshGrid();
                
                // Update post count for this month
                updatePostCount();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById('monthSelectorContainer').contains(e.target)) {
                monthDropdown.classList.add('hidden');
            }
            
            // Also close the post options dropdown if clicking outside
            if (document.getElementById('postOptionsMenu') && !document.getElementById('postOptionsMenu').contains(e.target)) {
                document.getElementById('postOptionsDropdown').classList.remove('active');
            }
        });

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const tabIndicator = document.querySelector('.tab-indicator');

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('text-gray-400');
                });
                button.classList.add('active');
                button.classList.remove('text-gray-400');
                
                // Update tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Move the indicator
                tabIndicator.style.transform = `translateX(${index * 100}%)`;
            });
        });

        // New Post Modal
        const newPostButton = document.getElementById('newPostButton');
        const newPostModal = document.getElementById('newPostModal');
        const cancelButton = document.getElementById('cancelButton');
        const selectFromComputerBtn = document.getElementById('selectFromComputerBtn');
        const fileInput = document.getElementById('fileInput');
        const previewContainer = document.getElementById('previewContainer');
        const uploadPrompt = document.getElementById('uploadPrompt');
        const imagePreview = document.getElementById('imagePreview');
        
        // Caption elements
        const uploadStep = document.getElementById('uploadStep');
        const captionStep = document.getElementById('captionStep');
        const nextButton = document.getElementById('nextButton');
        const backButton = document.getElementById('backButton');
        const shareButton = document.getElementById('shareButton');
        const captionInput = document.getElementById('captionInput');
        const captionCounter = document.getElementById('captionCounter');
        const captionImagePreview = document.getElementById('captionImagePreview');
        const postMonthSelect = document.getElementById('postMonthSelect');

        newPostButton.addEventListener('click', () => {
            newPostModal.classList.add('active');
            // Reset to first step
            uploadStep.classList.add('active');
            captionStep.classList.remove('active');
            
            // Set the month selector to the current viewing month
            postMonthSelect.value = currentViewingMonth;
        });

        cancelButton.addEventListener('click', () => {
            newPostModal.classList.remove('active');
            // Reset the upload state
            previewContainer.classList.add('hidden');
            uploadPrompt.classList.remove('hidden');
            fileInput.value = '';
            captionInput.value = '';
            captionCounter.textContent = '0';
        });

        selectFromComputerBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    previewContainer.classList.remove('hidden');
                    uploadPrompt.classList.add('hidden');
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        // Caption input character counter
        captionInput.addEventListener('input', () => {
            const length = captionInput.value.length;
            captionCounter.textContent = length;
        });
        
        // Next button - go to caption step
        nextButton.addEventListener('click', () => {
            if (fileInput.files && fileInput.files[0]) {
                // Show caption step
                uploadStep.classList.remove('active');
                captionStep.classList.add('active');
                
                // Set the image preview in caption step
                captionImagePreview.src = imagePreview.src;
            } else {
                // If no file is selected, use a placeholder image for demo purposes
                const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%234caf50'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3ESample Post%3C/text%3E%3C/svg%3E";
                imagePreview.src = placeholderImage;
                captionImagePreview.src = placeholderImage;
                previewContainer.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
                
                // Show caption step
                uploadStep.classList.remove('active');
                captionStep.classList.add('active');
            }
        });
        
        // Back button - return to upload step
        backButton.addEventListener('click', () => {
            uploadStep.classList.add('active');
            captionStep.classList.remove('active');
        });

        // Post View Modal
        const postViewModal = document.getElementById('postViewModal');
        const closePostViewButton = document.getElementById('closePostViewButton');
        const postViewImage = document.getElementById('postViewImage');
        const postViewCaption = document.getElementById('postViewCaption');
        const postViewMonth = document.getElementById('postViewMonth');
        
        // Post options menu
        const postOptionsMenu = document.getElementById('postOptionsMenu');
        const postOptionsDropdown = document.getElementById('postOptionsDropdown');
        const deletePostOption = document.getElementById('deletePostOption');
        const editCaptionOption = document.getElementById('editCaptionOption');

        closePostViewButton.addEventListener('click', () => {
            postViewModal.classList.remove('active');
            currentViewingPostIndex = -1;
        });
        
        // Toggle post options dropdown
        postOptionsMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            postOptionsDropdown.classList.toggle('active');
        });
        
        // Delete post from dropdown
        deletePostOption.addEventListener('click', () => {
            if (currentViewingPostIndex !== -1) {
                // Remove the post from the array for the current month
                posts[currentViewingMonth].splice(currentViewingPostIndex, 1);
                
                // Update post count
                updatePostCount();
                
                // Refresh the grid
                refreshGrid();
                
                // Close the modal
                postViewModal.classList.remove('active');
                currentViewingPostIndex = -1;
                
                // Show notification
                showNotification('Post deleted successfully');
            }
        });
        
        // Edit Caption Modal
        const editCaptionModal = document.getElementById('editCaptionModal');
        const cancelEditButton = document.getElementById('cancelEditButton');
        const saveEditButton = document.getElementById('saveEditButton');
        const confirmEditButton = document.getElementById('confirmEditButton');
        const editCaptionInput = document.getElementById('editCaptionInput');
        const editCaptionCounter = document.getElementById('editCaptionCounter');
        const editCaptionImage = document.getElementById('editCaptionImage');
        const editCaptionMonth = document.getElementById('editCaptionMonth');
        
        // Edit caption option from dropdown
        editCaptionOption.addEventListener('click', () => {
            if (currentViewingPostIndex !== -1) {
                const post = posts[currentViewingMonth][currentViewingPostIndex];
                
                // Set up the edit caption modal
                editCaptionInput.value = post.caption || '';
                editCaptionCounter.textContent = (post.caption || '').length;
                editCaptionImage.src = post.imageUrl;
                editCaptionMonth.textContent = post.month;
                
                // Show the edit caption modal
                editCaptionModal.classList.add('active');
                
                // Close the post options dropdown
                postOptionsDropdown.classList.remove('active');
            }
        });
        
        // Cancel edit button
        cancelEditButton.addEventListener('click', () => {
            editCaptionModal.classList.remove('active');
        });
        
        // Edit caption input character counter
        editCaptionInput.addEventListener('input', () => {
            const length = editCaptionInput.value.length;
            editCaptionCounter.textContent = length;
        });
        
        // Save edit button
        saveEditButton.addEventListener('click', saveEditedCaption);
        confirmEditButton.addEventListener('click', saveEditedCaption);
        
        // Function to save edited caption
        function saveEditedCaption() {
            if (currentViewingPostIndex !== -1) {
                // Update the caption in the posts array
                posts[currentViewingMonth][currentViewingPostIndex].caption = editCaptionInput.value;
                
                // Update the caption in the post view modal
                postViewCaption.textContent = editCaptionInput.value;
                
                // Close the edit caption modal
                editCaptionModal.classList.remove('active');
                
                // Show success notification
                showNotification('Caption updated successfully');
            }
        }

        // Function to create a new post
        function createNewPost(imageUrl, caption, month) {
            // Create post element with 4:5 aspect ratio
            const post = document.createElement('div');
            post.className = 'instagram-post';
            
            // Create image element
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Instagram Post';
            img.className = 'w-full h-full object-cover';
            
            // Add month badge
            const monthBadge = document.createElement('div');
            monthBadge.className = 'month-badge';
            monthBadge.textContent = month;
            
            // Append image and badge to post
            post.appendChild(img);
            post.appendChild(monthBadge);
            
            // Add to posts array for the specified month (at the beginning for newest first)
            posts[month].unshift({
                element: post,
                imageUrl: imageUrl,
                caption: caption || '',
                month: month,
                timestamp: Date.now()
            });
            
            // Update post count
            updatePostCount();
            
            // Refresh the grid if we're viewing the month this post was added to
            if (month === currentViewingMonth) {
                refreshGrid();
            }
        }
        
        // Function to update the post count
        function updatePostCount() {
            // Count total posts across all months
            let totalPosts = 0;
            for (const month in posts) {
                totalPosts += posts[month].length;
            }
            
            postCount = totalPosts;
            postCountElement.textContent = postCount;
            
            // Show/hide empty state based on current month's posts
            if (posts[currentViewingMonth].length === 0) {
                emptyFeed.classList.remove('hidden');
                instagramGrid.classList.add('hidden');
            } else {
                emptyFeed.classList.add('hidden');
                instagramGrid.classList.remove('hidden');
            }
        }
        
        // Function to refresh the grid with proper ordering
        function refreshGrid() {
            // Clear the grid
            instagramGrid.innerHTML = '';
            
            // Add all posts for the current month in the correct order (newest first)
            const currentMonthPosts = posts[currentViewingMonth];
            
            currentMonthPosts.forEach((post, index) => {
                const postElement = post.element.cloneNode(true);
                
                // Update click event with the current index
                postElement.addEventListener('click', () => {
                    openPostView(index);
                });
                
                instagramGrid.appendChild(postElement);
            });
        }
        
        // Function to open post view modal
        function openPostView(index) {
            const currentMonthPosts = posts[currentViewingMonth];
            
            if (index >= 0 && index < currentMonthPosts.length) {
                currentViewingPostIndex = index;
                const post = currentMonthPosts[index];
                
                postViewImage.src = post.imageUrl;
                postViewCaption.textContent = post.caption || 'Check out my latest post! #instagram #feed';
                postViewMonth.textContent = post.month;
                postViewModal.classList.add('active');
                
                // Make sure dropdown is closed when opening modal
                postOptionsDropdown.classList.remove('active');
            }
        }

        // Share button in caption step
        shareButton.addEventListener('click', () => {
            // Get the image source (either from file input or placeholder)
            const imageSource = captionImagePreview.src;
            
            // Get the selected month
            const selectedMonth = postMonthSelect.value;
            
            // Add the new post with caption and month
            createNewPost(imageSource, captionInput.value, selectedMonth);
            
            // If the post was added to a different month than we're viewing, show a notification
            if (selectedMonth !== currentViewingMonth) {
                showNotification(`Post added to ${selectedMonth}`);
            } else {
                showNotification('Post added successfully');
            }
            
            // Close and reset modal
            newPostModal.classList.remove('active');
            previewContainer.classList.add('hidden');
            uploadPrompt.classList.remove('hidden');
            fileInput.value = '';
            captionInput.value = '';
            captionCounter.textContent = '0';
            
            // Reset to first step
            uploadStep.classList.add('active');
            captionStep.classList.remove('active');
        });
        
        // Function to show a notification
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'948ab8658444fcf6',t:'MTc0ODczOTA2My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();