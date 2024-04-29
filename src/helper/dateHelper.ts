export function formatDate(date: Date): string {
    let month: string = '' + (date.getMonth() + 1), // Months are zero indexed
        day: string = '' + date.getDate(),
        year: number = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return `${year}-${month}-${day}`;
}