$(document).ready(function() {
    let currentFilter = 'all';
    let isDarkMode = false;
    const taskList = $('#taskList');
    const emptyListMessage = $('.empty-list-message');

    
    checkIfListEmpty();

    
    $('#themeToggle').on('click', function() {
        const htmlElement = $('html');
        isDarkMode = !isDarkMode;

        if (isDarkMode) {
            htmlElement.attr('data-bs-theme', 'dark');
            $(this).html('<i class="bi bi-sun-fill"></i>').removeClass('btn-outline-secondary').addClass('btn-outline-warning');
        } else {
            htmlElement.attr('data-bs-theme', 'light');
            $(this).html('<i class="bi bi-moon-fill"></i>').removeClass('btn-outline-warning').addClass('btn-outline-secondary');
        }
    });

    
    $('#addTaskForm').on('submit', function(e) {
        e.preventDefault();
        const taskText = $('#taskInput').val().trim();
        const dueDate = $('#dueDateInput').val(); 

        if (taskText !== '') {
            addTask(taskText, dueDate);
            $('#taskInput').val(''); 
            $('#dueDateInput').val(''); 
            checkIfListEmpty();
        }
    });

   
    function addTask(text, dueDate = '', isCompleted = false) {
        const completedClass = isCompleted ? 'completed' : '';
        const checkedAttr = isCompleted ? 'checked' : '';
        const dueDateDisplay = dueDate ? `<span class="badge text-bg-secondary ms-3 due-date-badge"><i class="bi bi-calendar"></i> Due: ${dueDate}</span>` : '';

        const taskItem = `
            <li class="list-group-item d-flex align-items-center ${completedClass}" data-duedate="${dueDate}">
                <div class="form-check me-3 flex-shrink-0">
                    <input class="form-check-input task-check" type="checkbox" ${checkedAttr}>
                </div>
                <div class="task-content flex-grow-1 d-flex flex-column flex-md-row align-items-md-center">
                    <span class="task-text">${text}</span>
                    <input type="text" class="form-control edit-input d-none" value="${text}">
                    ${dueDateDisplay}
                </div>
                <div class="task-actions flex-shrink-0 ms-auto">
                    <button class="btn btn-sm btn-outline-info me-2 edit-btn"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash-fill"></i></button>
                </div>
            </li>
        `;

        taskList.prepend(taskItem);
        applyFilter();
    }

    
    taskList.on('change', '.task-check', function() {
        const listItem = $(this).closest('.list-group-item');
        listItem.toggleClass('completed');
        applyFilter();
    });

    
    taskList.on('click', '.delete-btn', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            $(this).closest('.list-group-item').remove();
            checkIfListEmpty();
        }
    });

   
    taskList.on('click', '.edit-btn', function() {
        const listItem = $(this).closest('.list-group-item');
        const taskTextSpan = listItem.find('.task-text');
        const editInput = listItem.find('.edit-input');
        const isEditing = listItem.hasClass('editing');

        if (isEditing) {
            
            const newText = editInput.val().trim();
            if (newText !== '') {
                taskTextSpan.text(newText);
                taskTextSpan.removeClass('d-none');
                editInput.addClass('d-none');
                listItem.find('.due-date-badge').removeClass('d-none'); 
                $(this).html('<i class="bi bi-pencil-fill"></i>').removeClass('btn-success').addClass('btn-outline-info');
                listItem.removeClass('editing');
            } else {
                alert('Task cannot be empty!');
            }
        } else {
            
            taskTextSpan.addClass('d-none');
            editInput.removeClass('d-none').focus();
            listItem.find('.due-date-badge').addClass('d-none'); 
            $(this).html('<i class="bi bi-check-lg"></i>').removeClass('btn-outline-info').addClass('btn-success');
            listItem.addClass('editing');
        }
    });

   
    taskList.on('keypress', '.edit-input', function(e) {
        if (e.which == 13) {
            $(this).siblings('.edit-btn').click();
        }
    });


 
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        applyFilter();
    });

    function applyFilter() {
        let visibleCount = 0;
        taskList.children('li').not('.empty-list-message').each(function() {
            const isCompleted = $(this).hasClass('completed');
            let isVisible = false;

            if (currentFilter === 'all') {
                isVisible = true;
            } else if (currentFilter === 'active') {
                isVisible = !isCompleted;
            } else if (currentFilter === 'completed') {
                isVisible = isCompleted;
            }

            if (isVisible) {
                $(this).removeClass('d-none');
                visibleCount++;
            } else {
                $(this).addClass('d-none');
            }
        });

        
        if (currentFilter === 'all') {
            checkIfListEmpty();
        } else {
            emptyListMessage.hide();
        }
    }
     function checkIfListEmpty() {
        
        const taskCount = taskList.children('li').not('.empty-list-message').length;
        if (taskCount === 0) {
            emptyListMessage.show();
        } else {
            emptyListMessage.hide();
        }
    }
});
