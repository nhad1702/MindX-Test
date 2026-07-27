def selectElement(a, n):
    temp_arr = []
    for j in a:
        if j not in temp_arr:
            temp_arr.append(j)
    temp_arr.sort(reverse=True)
    if n <= len(temp_arr):
        return temp_arr[n-1]
    return -1

print(selectElement([6,5,2,7,1,3,4,8,9,10], 20))