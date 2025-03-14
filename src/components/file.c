#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FILENAME "students.dat"

void displayMenu();
void addStudent();
void viewStudents();
void searchStudent();
void updateStudent();
void deleteStudent();

typedef struct 
{
    int id;
    char name[50];
    char department[50];
    float cgpa;
} Student;

int main()
{
    int choose;

    while (1)
    {
        displayMenu();
        printf("Enter your choice: ");
        scanf("%d", &choose);
        getchar(); // Consume newline left by scanf

        switch (choose)
        {
            case 1: addStudent(); break;
            case 2: viewStudents(); break;
            case 3: searchStudent(); break;
            case 4: updateStudent(); break;
            case 5: deleteStudent(); break;
            case 6: 
                printf("Exiting program. Goodbye!\n"); 
                exit(0);
            default: 
                printf("Invalid choice. Try again.\n");
        }
    }
}

void displayMenu()
{
    printf("\n__ Students Record Management __\n");
    printf("1. Add Student\n");
    printf("2. View Students\n");
    printf("3. Search Student\n");
    printf("4. Update Student\n");
    printf("5. Delete Student\n");
    printf("6. Exit\n");
}


void addStudent()
{
    FILE *file = fopen(FILENAME, "ab");
    if (!file)
    {
        perror("Error opening file");
        return;
    }

    Student student;

    printf("Enter ID: ");
    scanf("%d", &student.id);
    getchar();

    printf("Enter Name: ");
    fgets(student.name, sizeof(student.name), stdin);
    student.name[strcspn(student.name, "\n")] = '\0'; // Remove newline

    printf("Enter Department: ");
    fgets(student.department, sizeof(student.department), stdin);
    student.department[strcspn(student.department, "\n")] = '\0'; // Remove newline

    printf("Enter CGPA: ");
    scanf("%f", &student.cgpa);

    fwrite(&student, sizeof(Student), 1, file);
    fclose(file);
    printf("Student added successfully.\n");
}

