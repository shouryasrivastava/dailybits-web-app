-- ============================================
-- DailyBits: AI-Powered Python Practice Platform
-- Sample Data (PostgreSQL)
-- ============================================

-- Reset sequences so auto-generated IDs start at 1
-- (dependent tables reference hardcoded IDs)
ALTER SEQUENCE account_account_number_seq RESTART WITH 1;
ALTER SEQUENCE problem_problem_id_seq RESTART WITH 1;
ALTER SEQUENCE solution_solution_id_seq RESTART WITH 1;
ALTER SEQUENCE problem_example_example_id_seq RESTART WITH 1;
ALTER SEQUENCE problem_constraint_constraint_id_seq RESTART WITH 1;
ALTER SEQUENCE algorithm_algorithm_id_seq RESTART WITH 1;
ALTER SEQUENCE submission_submission_id_seq RESTART WITH 1;
ALTER SEQUENCE study_plan_plan_id_seq RESTART WITH 1;
ALTER SEQUENCE todo_item_todo_id_seq RESTART WITH 1;
ALTER SEQUENCE study_note_note_id_seq RESTART WITH 1;
ALTER SEQUENCE chat_query_query_id_seq RESTART WITH 1;

-- ============================================
-- USER DATA
-- ============================================
INSERT INTO user_profile (email, first_name, last_name) VALUES
    ('ma.ruit@northeastern.edu', 'Elly', 'Ma'),
    ('zhang.shuyi1@husky.neu.edu', 'Susie', 'Zhang'),
    ('student@gmail.com', 'Northeastern', 'Student'),
    ('admin@gmail.com', 'Admin', 'User'),
    ('test.delete.user@gmail.com', 'Delete', 'Me'),
    ('alex.chen@gmail.com', 'Alex', 'Chen'),
    ('maya.patel@gmail.com', 'Maya', 'Patel'),
    ('jordan.wells@gmail.com', 'Jordan', 'Wells'),
    ('sofia.garcia@gmail.com', 'Sofia', 'Garcia'),
    ('liam.brooks@gmail.com', 'Liam', 'Brooks'),
    ('amira.hassan@gmail.com', 'Amira', 'Hassan');

INSERT INTO user_auth (email, password) VALUES
    ('ma.ruit@northeastern.edu', 'hashed_password_1'),
    ('zhang.shuyi1@husky.neu.edu', 'hashed_password_2'),
    ('student@gmail.com', 'hashed_password_3'),
    ('admin@gmail.com', 'admin_hashed_password'),
    ('test.delete.user@gmail.com', 'test_delete_user_password'),
    ('alex.chen@gmail.com', 'hashed_password_4'),
    ('maya.patel@gmail.com', 'hashed_password_5'),
    ('jordan.wells@gmail.com', 'hashed_password_6'),
    ('sofia.garcia@gmail.com', 'hashed_password_7'),
    ('liam.brooks@gmail.com', 'hashed_password_8'),
    ('amira.hassan@gmail.com', 'hashed_password_9');

INSERT INTO account (email, register_date, student_flag, admin_flag) VALUES
    ('ma.ruit@northeastern.edu', '2025-01-15', TRUE, FALSE),
    ('zhang.shuyi1@husky.neu.edu', '2025-01-20', TRUE, FALSE),
    ('student@gmail.com', '2025-02-10', TRUE, FALSE),
    ('admin@gmail.com', '2025-01-01', FALSE, TRUE),
    ('test.delete.user@gmail.com', '2025-02-01', TRUE, FALSE),
    ('alex.chen@gmail.com', '2025-02-05', TRUE, FALSE),
    ('maya.patel@gmail.com', '2025-02-07', TRUE, FALSE),
    ('jordan.wells@gmail.com', '2025-02-08', TRUE, FALSE),
    ('sofia.garcia@gmail.com', '2025-02-12', TRUE, FALSE),
    ('liam.brooks@gmail.com', '2025-02-14', TRUE, FALSE),
    ('amira.hassan@gmail.com', '2025-02-16', TRUE, FALSE);


-- ============================================
-- PROBLEM DATA
-- ============================================
INSERT INTO problem (difficulty_level, problem_title, problem_description, starter_code, is_published, estimate_time_baseline) VALUES
(
    'Easy',
    'Two Sum',
    $$Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.$$,
    $$def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Valid Palindrome',
    $$Return true if a string is a palindrome after removing non-alphanumeric characters and lowercasing.$$,
    $$def isPalindrome(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Contains Duplicate',
    $$Given an integer array nums, return true if any value appears at least twice.$$,
    $$def containsDuplicate(nums: List[int]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Medium',
    'Product of Array Except Self',
    $$Return an array answer such that answer[i] is the product of all the elements of nums except nums[i].$$,
    $$def productExceptSelf(nums: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Coin Change',
    $$Return the fewest number of coins needed to make up a given amount, or -1 if impossible.$$,
    $$def coinChange(coins: List[int], amount: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Valid Parentheses',
    $$Determine if the input string has valid matching brackets.$$,
    $$def isValid(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Medium',
    'Queue Using Stacks',
    $$Implement a FIFO queue using only two stacks.$$,
    $$class MyQueue:
    def __init__(self):
        # Write your code here
        pass$$,
    FALSE,
    30
),

(
    'Hard',
    'Longest Substring Without Repeating Characters',
    $$Find the length of the longest substring without repeating characters.$$,
    $$def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    35
),

(
    'Hard',
    'Edit Distance',
    $$Return the minimum number of operations required to convert one word to another.$$,
    $$def minDistance(word1: str, word2: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),

(
    'Hard',
    'Maximum Depth of Binary Tree',
    $$Given the root of a binary tree, return its maximum depth.$$,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Easy',
    'Best Time to Buy and Sell Stock',
    $$You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.$$,
    $$def maxProfit(prices: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Easy',
    'Valid Anagram',
    $$Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word.$$,
    $$def isAnagram(s: str, t: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Majority Element',
    $$Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.$$,
    $$def majorityElement(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Move Zeroes',
    $$Given an integer array nums, move all 0's to the end while maintaining the relative order of the non-zero elements. Note that you must do this in-place.$$,
    $$def moveZeroes(nums: List[int]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Merge Sorted Array',
    $$You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n. Merge nums2 into nums1 as one sorted array.$$,
    $$def merge(nums1: List[int], m: int, nums2: List[int], n: int) -> None:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Easy',
    'Reverse String',
    $$Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.$$,
    $$def reverseString(s: List[str]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'First Unique Character',
    $$Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.$$,
    $$def firstUniqChar(s: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Min Stack',
    $$Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.$$,
    $$class MinStack:
    def __init__(self):
        # Write your code here
        pass$$,
    TRUE,
    20
),

(
    'Easy',
    'Plus One',
    $$You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array of digits.$$,
    $$def plusOne(digits: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Remove Duplicates from Sorted Array',
    $$Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.$$,
    $$def removeDuplicates(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Invert Binary Tree',
    $$Given the root of a binary tree, invert the tree, and return its root.$$,
    $$def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Easy',
    'Longest Common Prefix',
    $$Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.$$,
    $$def longestCommonPrefix(strs: List[str]) -> str:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Easy',
    'Find Pivot Index',
    $$Given an array of integers nums, calculate the pivot index of this array. The pivot index is where the sum of all numbers to the left equals the sum of all numbers to the right.$$,
    $$def pivotIndex(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Easy',
    'Intersection of Two Arrays II',
    $$Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays.$$,
    $$def intersect(nums1: List[int], nums2: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Symmetric Tree',
    $$Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).$$,
    $$def isSymmetric(root: Optional[TreeNode]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Rotate Array',
    $$Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.$$,
    $$def rotate(nums: List[int], k: int) -> None:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Group Anagrams',
    $$Given an array of strings strs, group the anagrams together. You can return the answer in any order.$$,
    $$def groupAnagrams(strs: List[str]) -> List[List[str]]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'House Robber',
    $$You are a professional robber. Each house has a certain amount of money. Adjacent houses have security systems connected. Determine the maximum amount you can rob tonight without alerting the police.$$,
    $$def rob(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Container With Most Water',
    $$You are given an integer array height. Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.$$,
    $$def maxArea(height: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Daily Temperatures',
    $$Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.$$,
    $$def dailyTemperatures(temperatures: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Maximum Subarray',
    $$Given an integer array nums, find the subarray with the largest sum, and return its sum.$$,
    $$def maxSubArray(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Binary Tree Level Order Traversal',
    $$Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).$$,
    $$def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Top K Frequent Elements',
    $$Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.$$,
    $$def topKFrequent(nums: List[int], k: int) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Longest Increasing Subsequence',
    $$Given an integer array nums, return the length of the longest strictly increasing subsequence.$$,
    $$def lengthOfLIS(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    30
),

(
    'Medium',
    'Find Peak Element',
    $$A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index.$$,
    $$def findPeakElement(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Longest Repeating Character Replacement',
    $$You are given a string s and an integer k. You can choose any character and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get.$$,
    $$def characterReplacement(s: str, k: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    30
),

(
    'Medium',
    'Design Circular Queue',
    $$Design your implementation of the circular queue. The circular queue is a linear data structure in which operations are performed based on FIFO principle.$$,
    $$class MyCircularQueue:
    def __init__(self, k: int):
        # Write your code here
        pass$$,
    TRUE,
    30
),

(
    'Medium',
    'Jump Game',
    $$You are given an integer array nums. You are initially positioned at the array's first index, and each element represents your maximum jump length. Return true if you can reach the last index.$$,
    $$def canJump(nums: List[int]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Validate Binary Search Tree',
    $$Given the root of a binary tree, determine if it is a valid binary search tree (BST).$$,
    $$def isValidBST(root: Optional[TreeNode]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Decode String',
    $$Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is repeated exactly k times.$$,
    $$def decodeString(s: str) -> str:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Hard',
    'Regular Expression Matching',
    $$Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.$$,
    $$def isMatch(s: str, p: str) -> bool:
    # Write your code here
    pass$$,
    FALSE,
    45
),

(
    'Hard',
    'Median of Two Sorted Arrays',
    $$Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).$$,
    $$def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:
    # Write your code here
    pass$$,
    FALSE,
    40
),

(
    'Hard',
    'Longest Valid Parentheses',
    $$Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.$$,
    $$def longestValidParentheses(s: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),

(
    'Hard',
    'Minimum Window Substring',
    $$Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.$$,
    $$def minWindow(s: str, t: str) -> str:
    # Write your code here
    pass$$,
    FALSE,
    45
),

(
    'Hard',
    'Binary Tree Maximum Path Sum',
    $$A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. The path sum is the sum of the node values. Return the maximum path sum of any non-empty path.$$,
    $$def maxPathSum(root: Optional[TreeNode]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),

(
    'Hard',
    'Largest Rectangle in Histogram',
    $$Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.$$,
    $$def largestRectangleArea(heights: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    45
),

(
    'Hard',
    'Trapping Rain Water',
    $$Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.$$,
    $$def trap(height: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),

(
    'Hard',
    'Jump Game II',
    $$You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Return the minimum number of jumps to reach nums[n - 1].$$,
    $$def jump(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    35
),

(
    'Hard',
    'Word Ladder',
    $$A transformation sequence from word beginWord to word endWord is a sequence where adjacent words differ by a single letter. Given two words and a word list, find the length of shortest transformation sequence, or 0 if none exists.$$,
    $$def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    45
),

(
    'Easy',
    'Climbing Stairs',
    $$Return the number of distinct ways to climb a staircase where each move is either one or two steps.$$,
    $$def climbing_stairs(n: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Reverse Linked List',
    $$Given the head of a singly linked list, reverse the list and return the new head.$$,
    $$def reverse_linked_list(head) -> Optional[ListNode]:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Medium',
    'Add Two Numbers',
    $$You are given two non-empty linked lists representing two non-negative integers. Add them and return the head of the sum list.$$,
    $$def add_two_numbers(l1, l2) -> Optional[ListNode]:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Easy',
    'Merge Two Sorted Lists',
    $$Merge two sorted linked lists and return one ascending sorted list.$$,
    $$def merge_two_sorted_lists(list1, list2) -> Optional[ListNode]:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Medium',
    'Remove Nth Node From End of List',
    $$Remove the nth node from the end of a linked list and return the head.$$,
    $$def remove_nth_node_from_end_of_list(head, n) -> Optional[ListNode]:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Medium',
    'Longest Palindromic Substring',
    $$Find the longest palindromic substring in a given string.$$,
    $$def longest_palindromic_substring(s: str) -> str:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'String to Integer (atoi)',
    $$Convert a string to a 32-bit signed integer with trimming and sign handling.$$,
    $$def string_to_integer_atoi(s: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Easy',
    'Sqrt(x)',
    $$Given a non-negative integer x, return the integer square root truncated down.$$,
    $$def sqrt_x(x: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Power of Four',
    $$Check if an integer is a power of four.$$,
    $$def power_of_four(n: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    5
),

(
    'Easy',
    'Hamming Distance',
    $$Compute the number of differing bits between two integers.$$,
    $$def hamming_distance(x: int, y: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'Number of 1 Bits',
    $$Return the number of set bits in a non-negative integer.$$,
    $$def number_of1_bits(n: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'Missing Number',
    $$Given numbers from 0..n with one missing, find the missing one.$$,
    $$def missing_number(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'Find the Duplicate Number',
    $$Find the one duplicated number in an array containing n+1 integers between 1 and n.$$,
    $$def find_the_duplicate_number(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'First Unique Character in a String',
    $$Find the index of first non-repeating character in a string.$$,
    $$def first_unique_character_in_a_string(s: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'Maximum Number of Balloons',
    $$Given a string text, return the maximum number of instances of the word "balloon" that can be formed using each character at most once.$$,
    $$def max_number_of_balloons(text: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Remove Duplicates from Sorted Array II',
    $$Allow at most two equal elements in-place and return new length.$$,
    $$def remove_duplicates_from_sorted_array_ii(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Move Zeroes to Front',
    $$Move all zeroes to the front while preserving non-zero order in the rest.$$,
    $$def move_zeroes_to_front(nums: list[int]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Easy',
    'Maximum Difference Between Increasing Elements',
    $$Given an integer array nums, return the maximum difference nums[j] - nums[i] such that i < j and nums[i] < nums[j]. Return -1 if no such pair exists.$$,
    $$def maximum_difference(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Two Sum II',
    $$Given a sorted array, find two numbers summing to target and return indices.$$,
    $$def two_sum_ii(numbers: list[int], target: int) -> list[int]:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Medium',
    '3Sum',
    $$Find all unique triplets that sum to zero.$$,
    $$def threeSum(nums: list[int]) -> list[list[int]]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    '3Sum Closest',
    $$Return sum of three integers closest to target.$$,
    $$def threeSumClosest(nums: list[int], target: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Letter Combinations of a Phone Number',
    $$Return all letter combinations that a digit string can represent.$$,
    $$def letter_combinations_of_a_phone_number(digits: str) -> list[str]:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Medium',
    'Generate Parentheses',
    $$Generate all valid combinations of n pairs of parentheses.$$,
    $$def generate_parentheses(n: int) -> list[str]:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Easy',
    'Merge Two Binary Trees',
    $$Combine two binary trees by summing overlapping nodes.$$,
    $$def merge_two_binary_trees(root1, root2) -> Optional[TreeNode]:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Medium',
    'Path Sum',
    $$Determine if there exists a root-to-leaf path that sums to target.$$,
    $$def path_sum(root: Optional[TreeNode], targetSum: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    16
),

(
    'Medium',
    'Search in Rotated Sorted Array',
    $$Find index of target in rotated sorted array with distinct values.$$,
    $$def search_in_rotated_sorted_array(nums: list[int], target: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    16
),

(
    'Medium',
    'Find Minimum in Rotated Sorted Array',
    $$Find minimum element in rotated sorted array with no duplicates.$$,
    $$def find_minimum_in_rotated_sorted_array(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Medium',
    'Kth Largest Element in an Array',
    $$Find the kth largest element in an unsorted array.$$,
    $$def kth_largest_element_in_an_array(nums: list[int], k: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Hard',
    'Find Kth Largest in Stream',
    $$Design a data structure that returns kth largest after each insertion.$$,
    $$def find_kth_largest_in_stream(k: int, nums: list[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    25
),

(
    'Medium',
    'Intersection of Two Arrays',
    $$Return unique common elements between two arrays.$$,
    $$def intersection_of_two_arrays(nums1: list[int], nums2: list[int]) -> list[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Contains Duplicate II',
    $$Check if any value appears within distance k of another equal value.$$,
    $$def contains_duplicate_ii(nums: list[int], k: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Easy',
    'Single Number',
    $$Find the element appearing once when every other appears twice.$$,
    $$def single_number(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Easy',
    'Single Number II',
    $$Find element appearing once while others appear three times.$$,
    $$def single_number_ii(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),

(
    'Easy',
    'Majority Element II',
    $$Find all elements that appear more than n/3 times.$$,
    $$def majority_element_ii(nums: list[int]) -> list[int]:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Sort Colors',
    $$Sort array containing 0,1,2 in-place.$$,
    $$def sort_colors(nums: list[int]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Hard',
    'Number of Islands',
    $$Count the number of connected land components in a 2D grid.$$,
    $$def number_of_islands(grid: list[list[str]]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    30
),

(
    'Medium',
    'Surrounded Regions',
    $$Capture regions fully surrounded by X in a board by flipping O to X.$$,
    $$def surrounded_regions(board: list[list[str]]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    32
),

(
    'Easy',
    'Valid Palindrome II',
    $$Check if string can be palindrome after deleting at most one char.$$,
    $$def valid_palindrome_ii(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Medium',
    'Search a 2D Matrix',
    $$Find target in row-major and column-sorted matrix.$$,
    $$def search_a2d_matrix(matrix: list[list[int]], target: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    16
),

(
    'Medium',
    'Repeated Substring of Length K',
    $$Given a string s and integer k, return true if some substring of length exactly k appears at least twice.$$,
    $$def has_repeated_substring_of_length_k(s: str, k: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    10
),

(
    'Hard',
    'Word Ladder II',
    $$Return all shortest transformation sequences from beginWord to endWord.$$,
    $$def word_ladder_ii(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
    # Write your code here
    pass$$,
    TRUE,
    40
),

(
    'Easy',
    'Is Subsequence',
    $$Check if t is a subsequence of s.$$,
    $$def is_subsequence(s: str, t: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    8
),

(
    'Medium',
    'Longest Substring with At Most Two Distinct Characters',
    $$Given a string s, return the length of the longest substring that contains at most two distinct characters.$$,
    $$def length_of_longest_substring_two_distinct(s: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),

(
    'Medium',
    'Minimum Number of Subarrays to Delete',
    $$Find minimum subarray removals to make array non-decreasing.$$,
    $$def minimum_number_of_subarrays_to_delete(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Subarray Sum Equals K',
    $$Count subarrays whose sum equals k.$$,
    $$def subarray_sum_equals_k(nums: list[int], k: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    15
),

(
    'Medium',
    'Minimum Size Subarray Sum',
    $$Find minimal length subarray with sum at least target.$$,
    $$def minimum_size_subarray_sum(target: int, nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Longest Substring with At Most K Distinct Characters',
    $$Return max window length with at most k distinct chars.$$,
    $$def longest_substring_with_at_most_k_distinct_characters(s: str, k: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    16
),

(
    'Medium',
    'Continuous Subarray Sum',
    $$Check if subarray length >=2 has sum multiple of k.$$,
    $$def continuous_subarray_sum(nums: list[int], k: int) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Maximum Product Subarray',
    $$Return maximum product of a contiguous non-empty subarray.$$,
    $$def maximum_product_subarray(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),

(
    'Medium',
    'Maximum Sum Circular Subarray',
    $$Find maximum possible sum of non-empty circular subarray.$$,
    $$def maximum_sum_circular_subarray(nums: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    22
),

(
    'Medium',
    'Best Time to Buy and Sell Stock with Cooldown',
    $$Maximize profit with one-day cooldown between sells and next buy.$$,
    $$def best_time_to_buy_and_sell_stock_with_cooldown(prices: list[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
);

-- ============================================
-- PROBLEM EXAMPLES DATA
-- ============================================
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    1,
    $$nums = [2,7,11,15], target = 9$$,
    $$[0,1]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    2,
    $$s = "A man, a plan, a canal: Panama"$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    3,
    $$nums = [1,2,3,1]$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    4,
    $$nums = [1,2,3,4]$$,
    $$[24,12,8,6]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    5,
    $$coins = [1,2,5], amount = 11$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    6,
    $$s = "()[]{}"$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    7,
    $$["MyQueue","push","push","peek","pop","empty"], [[],[1],[2],[],[],[]]$$,
    $$[null,null,null,1,1,false]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    8,
    $$s = "abcabcbb"$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    9,
    $$word1 = "horse", word2 = "ros"$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    10,
    $$root = [3,9,20,null,null,15,7]$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    11,
    $$prices = [7,1,5,3,6,4]$$,
    $$5$$,
    $$Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    12,
    $$s = "anagram", t = "nagaram"$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    13,
    $$nums = [3,2,3]$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    14,
    $$nums = [0,1,0,3,12]$$,
    $$[1,3,12,0,0]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    15,
    $$nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3$$,
    $$[1,2,2,3,5,6]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    16,
    $$s = ["h","e","l","l","o"]$$,
    $$["o","l","l","e","h"]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    17,
    $$s = "leetcode"$$,
    $$0$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    18,
    $$["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]$$,
    $$[null,null,null,null,-3,null,0,-2]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    19,
    $$digits = [1,2,3]$$,
    $$[1,2,4]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    20,
    $$nums = [1,1,2]$$,
    $$2, nums = [1,2,_]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    21,
    $$root = [4,2,7,1,3,6,9]$$,
    $$[4,7,2,9,6,3,1]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    22,
    $$strs = ["flower","flow","flight"]$$,
    $$"fl"$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    23,
    $$nums = [1,7,3,6,5,6]$$,
    $$3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    24,
    $$nums1 = [1,2,2,1], nums2 = [2,2]$$,
    $$[2,2]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    25,
    $$root = [1,2,2,3,4,4,3]$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    26,
    $$nums = [1,2,3,4,5,6,7], k = 3$$,
    $$[5,6,7,1,2,3,4]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    27,
    $$strs = ["eat","tea","tan","ate","nat","bat"]$$,
    $$[["bat"],["nat","tan"],["ate","eat","tea"]]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    28,
    $$nums = [1,2,3,1]$$,
    $$4$$,
    $$Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    29,
    $$height = [1,8,6,2,5,4,8,3,7]$$,
    $$49$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    30,
    $$temperatures = [73,74,75,71,69,72,76,73]$$,
    $$[1,1,4,2,1,1,0,0]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    31,
    $$nums = [-2,1,-3,4,-1,2,1,-5,4]$$,
    $$6$$,
    $$The subarray [4,-1,2,1] has the largest sum 6.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    32,
    $$root = [3,9,20,null,null,15,7]$$,
    $$[[3],[9,20],[15,7]]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    33,
    $$nums = [1,1,1,2,2,3], k = 2$$,
    $$[1,2]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    34,
    $$nums = [10,9,2,5,3,7,101,18]$$,
    $$4$$,
    $$The longest increasing subsequence is [2,3,7,101], therefore the length is 4.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    35,
    $$nums = [1,2,3,1]$$,
    $$2$$,
    $$3 is a peak element.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    36,
    $$s = "ABAB", k = 2$$,
    $$4$$,
    $$Replace the two 'A's with two 'B's or vice versa.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    37,
    $$["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]$$,
    $$[null, true, true, true, false, 3, true, true, true, 4]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    38,
    $$nums = [2,3,1,1,4]$$,
    $$true$$,
    $$Jump 1 step from index 0 to 1, then 3 steps to the last index.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    39,
    $$root = [2,1,3]$$,
    $$true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    40,
    $$s = "3[a]2[bc]"$$,
    $$"aaabcbc"$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    41,
    $$s = "aa", p = "a*"$$,
    $$true$$,
    $$'*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    42,
    $$nums1 = [1,3], nums2 = [2]$$,
    $$2.00000$$,
    $$merged array = [1,2,3] and median is 2.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    43,
    $$s = "(()"$$,
    $$2$$,
    $$The longest valid parentheses substring is "()".$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    44,
    $$s = "ADOBECODEBANC", t = "ABC"$$,
    $$"BANC"$$,
    $$The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    45,
    $$root = [1,2,3]$$,
    $$6$$,
    $$The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    46,
    $$heights = [2,1,5,6,2,3]$$,
    $$10$$,
    $$The largest rectangle has area = 10 (heights 5 and 6).$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    47,
    $$height = [0,1,0,2,1,0,1,3,2,1,2,1]$$,
    $$6$$,
    $$The elevation map traps 6 units of rain water.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    48,
    $$nums = [2,3,1,1,4]$$,
    $$2$$,
    $$Jump 1 step from index 0 to 1, then 3 steps to the last index.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    49,
    $$beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]$$,
    $$5$$,
    $$"hit" -> "hot" -> "dot" -> "dog" -> "cog"$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    50,
    $$Input: n = 3$$,
    $$Output: 3$$,
    $$Ways are [1,1,1], [1,2], [2,1].$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    51,
    $$Input: [1,2,3,4,5]$$,
    $$Output: [5,4,3,2,1]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    52,
    $$Input: l1 = [2,4,3], l2 = [5,6,4]$$,
    $$Output: [7,0,8]$$,
    $$342 + 465 = 807.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    53,
    $$Input: [1,2,4], [1,3,4]$$,
    $$Output: [1,1,2,3,4,4]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    54,
    $$Input: [1,2,3,4,5], n = 2$$,
    $$Output: [1,2,3,5]$$,
    $$The 2nd node from end is value 4.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    55,
    $$Input: s = "babad"$$,
    $$Output: "bab"$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    56,
    $$Input: s = "42"$$,
    $$Output: 42$$,
    $$Whitespace and non-digit suffix should be ignored.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    57,
    $$Input: x = 8$$,
    $$Output: 2$$,
    $$Only integer floor value is returned.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    58,
    $$Input: n = 16$$,
    $$Output: true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    59,
    $$Input: x = 1, y = 4$$,
    $$Output: 2$$,
    $$1 (001) and 4 (100) differ by two bits.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    60,
    $$Input: n = 11$$,
    $$Output: 3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    61,
    $$Input: [3,0,1]$$,
    $$Output: 2$$,
    $$For n=3 all numbers should be 0..3.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    62,
    $$Input: [1,3,4,2,2]$$,
    $$Output: 2$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    63,
    $$Input: s = "leetcode"$$,
    $$Output: 0$$,
    $$Character "l" appears once at index 0.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    64,
    $$Input: text = "loonbalxballpoon"$$,
    $$Output: 2$$,
    $$The letters can form "balloon" two times.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    65,
    $$Input: [1,1,1,2,2,3]$$,
    $$Output: 5$$,
    $$Result can be [1,1,2,2,3,...].$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    66,
    $$Input: [0,1,0,3,12]$$,
    $$Output: [0,0,1,3,12]$$,
    $$Relative order of non-zero items remains unchanged.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    67,
    $$Input: nums = [7,1,5,4]$$,
    $$Output: 4$$,
    $$Choose i = 1 (value 1) and j = 2 (value 5).$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    68,
    $$Input: numbers = [2,7,11,15], target = 9$$,
    $$Output: [1,2]$$,
    $$1-based indices of the matching pair.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    69,
    $$Input: [-1,0,1,2,-1,-4]$$,
    $$Output: [[-1,-1,2],[-1,0,1]]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    70,
    $$Input: [-1,2,1,-4], target = 1$$,
    $$Output: 2$$,
    $$Triplet [-1,1,2] sums to 2.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    71,
    $$Input: digits = "23"$$,
    $$Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    72,
    $$Input: n = 3$$,
    $$Output: ["((()))","(()())","(())()","()(())","()()()"]$$,
    $$Order by construction lexicographically.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    73,
    $$Input: [1,3,2,5], [2,1,3,null,4,null,7]$$,
    $$Output: [3,4,5,5,4,null,7]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    74,
    $$Input: [5,4,8,11,null,13,4,7,2,null,null,null,1], 22$$,
    $$Output: true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    75,
    $$Input: [4,5,6,7,0,1,2], 0$$,
    $$Output: 4$$,
    $$Target found at index 4.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    76,
    $$Input: [3,4,5,1,2]$$,
    $$Output: 1$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    77,
    $$Input: [3,2,3,1,2,4,5,5,6], k = 4$$,
    $$Output: 4$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    78,
    $$Input: k=3, stream=[4,5,8,2], add(3), add(5), add(10), add(9), add(4)$$,
    $$Output: [4,5,5,8]$$,
    $$Third largest after each add is shown.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    79,
    $$Input: [1,2,2,1], [2,2]$$,
    $$Output: [2]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    80,
    $$Input: [1,2,3,1], k = 3$$,
    $$Output: true$$,
    $$Duplicate 1s are 3 apart.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    81,
    $$Input: [2,2,1]$$,
    $$Output: 1$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    82,
    $$Input: [2,2,2,3]$$,
    $$Output: 3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    83,
    $$Input: [3,2,3]$$,
    $$Output: [3]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    84,
    $$Input: [2,0,2,1,1,0]$$,
    $$Output: [0,0,1,1,2,2]$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    85,
    $$Input: [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]$$,
    $$Output: 3$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    86,
    $$Input: [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]$$,
    $$Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]$$,
    $$Only border-connected O are preserved.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    87,
    $$Input: "abca"$$,
    $$Output: true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    88,
    $$Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3$$,
    $$Output: true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    89,
    $$Input: s = "banana", k = 3$$,
    $$Output: true$$,
    $$Substring "ana" appears at indices [1..3] and [3..5].$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    90,
    $$Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]$$,
    $$Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]$$,
    $$Classic BFS + backtracking paths.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    91,
    $$Input: s = "abcde", t = "ace"$$,
    $$Output: true$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    92,
    $$Input: s = "eceba"$$,
    $$Output: 3$$,
    $$Substring "ece" has length 3 and at most two distinct characters.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    93,
    $$Input: [1,3,2,2,2,5]$$,
    $$Output: 1$$,
    $$Remove [3] to get [1,2,2,2,5], which is non-decreasing.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    94,
    $$Input: [1,1,1], k = 2$$,
    $$Output: 2$$,
    $$Two subarrays: [1,1] and [1,1].$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    95,
    $$Input: target = 7, nums = [2,3,1,2,4,3]$$,
    $$Output: 2$$,
    $$Subarray [4,3] is shortest with sum >= 7.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    96,
    $$Input: s = "eceba", k = 2$$,
    $$Output: 3$$,
    $$Substring "ece" has two distinct chars.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    97,
    $$Input: [23,2,4,6,7], k = 6$$,
    $$Output: true$$,
    $$Subarray [2,4] sums to 6.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    98,
    $$Input: [2,3,-2,4]$$,
    $$Output: 6$$,
    NULL
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    99,
    $$Input: [1,-2,3,-2]$$,
    $$Output: 3$$,
    $$Either normal max or total - min suffix/prefix.$$
)
;
INSERT INTO problem_example (problem_id, example_input, example_output, example_explanation) VALUES
(
    100,
    $$Input: [1,2,3,0,2]$$,
    $$Output: 3$$,
    $$Buy at 1, sell at 2, cooldown one day, then buy at 0 and sell at 2 (total 3).$$
)
;

-- ============================================
-- PROBLEM CONSTRAINTS DATA
-- ============================================
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(1, $$2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(2, $$1 <= s.length <= 2 * 10^5, s consists of printable ASCII characters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(3, $$1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(4, $$2 <= nums.length <= 10^5, -30 <= nums[i] <= 30$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(5, $$1 <= amount <= 10^4, 1 <= len(coins) <= 12, 1 <= coins[i] <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(6, $$1 <= s.length <= 10^4, s[i] is one of {}[]()$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(7, $$Operations count is valid for a queue API and k in constructor is non-negative$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(8, $$0 <= len(s) <= 5 * 10^4, s is ASCII letters/digits/symbols$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(9, $$0 <= len(word1), len(word2) <= 500, only lowercase English letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(10, $$0 <= number of nodes <= 10^4, -100 <= Node.val <= 100$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(11, $$1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(12, $$1 <= len(s), len(t) <= 5 * 10^4, s and t contain lowercase English letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(13, $$1 <= nums.length <= 5 * 10^4, -10^9 <= nums[i] <= 10^9$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(14, $$1 <= nums.length <= 3 * 10^4, -2^31 <= nums[i] <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(15, $$nums1.length == m + n, 0 <= m <= 1000, 0 <= n <= 1000, nums1 and nums2 sorted non-decreasingly$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(16, $$1 <= len(s) <= 10^5, s[i] is ASCII character$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(17, $$1 <= len(s) <= 10^5, s contains only lowercase letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(18, $$Operations are valid for stack usage; values are integers$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(19, $$1 <= len(digits) <= 100, each digits[i] is digit 0..9, digits has no leading zeros unless equals [0]$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(20, $$1 <= nums.length <= 3 * 10^4, nums is sorted non-decreasingly$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(21, $$Number of nodes is in [0, 100], -100 <= Node.val <= 100$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(22, $$1 <= strs.length <= 200, 0 <= strs[i].length <= 200$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(23, $$1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(24, $$1 <= nums1.length, nums2.length <= 1000, -10^9 <= nums[i] <= 10^9$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(25, $$0 <= number of nodes <= 1000, -100 <= Node.val <= 100$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(26, $$1 <= nums.length <= 10^5, 0 <= k <= 10^9, -10^4 <= nums[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(27, $$1 <= len(strs) <= 100, 0 <= len(strs[i]) <= 100, lowercase English letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(28, $$1 <= len(nums) <= 100, 0 <= nums[i] <= 400$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(29, $$2 <= n <= 10^5, 0 <= height[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(30, $$1 <= len(temperatures) <= 10^5, 30 <= temperatures[i] <= 100$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(31, $$1 <= len(nums) <= 10^5, -10^4 <= nums[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(32, $$0 <= number of nodes <= 2000, -100 <= Node.val <= 100$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(33, $$1 <= len(nums) <= 10^5, -10^4 <= nums[i] <= 10^4, 1 <= k <= len(nums)$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(34, $$1 <= len(nums) <= 2500, -10^9 <= nums[i] <= 10^9$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(35, $$1 <= len(nums) <= 10^4, nums[i] may be negative$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(36, $$1 <= len(s) <= 10^5, 1 <= k <= len(s), s contains uppercase letters A-Z$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(37, $$0 <= k <= 1000, number of method calls is within valid limits and non-negative integers$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(38, $$1 <= len(nums) <= 10^4, 0 <= nums[i] <= 10^5$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(39, $$0 <= number of nodes <= 10^4, -10^4 <= Node.val <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(40, $$1 <= len(s) <= 30, 2 <= k <= 300 for brackets encoding, nested depth valid$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(41, $$0 <= len(s), len(p) <= 20, s and p contain lowercase letters and special chars . *$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(42, $$0 <= m, n <= 1000, 1 <= m+n <= 2000, arrays are sorted non-decreasingly, values in [-10^6, 10^6]$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(43, $$0 <= len(s) <= 3 * 10^5, s contains only ( and )$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(44, $$1 <= len(s) <= 10^5, 1 <= len(t) <= 10^5, lowercase ASCII letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(45, $$0 <= nodes <= 3 * 10^4, -1000 <= Node.val <= 1000$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(46, $$1 <= n <= 10^5, 0 <= heights[i] <= 10^4$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(47, $$1 <= n <= 3 * 10^4, 0 <= height[i] <= 10^5$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(48, $$1 <= len(nums) <= 10^5, 0 <= nums[i] <= 1000, nums[0] > 0$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(49, $$1 <= len(beginWord), len(endWord) <= 10, len(wordList) <= 5000, all words are lowercase letters$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(50, $$1 <= n <= 45$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(51, $$The list length is between 1 and 5000.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(52, $$Each list length is between 1 and 100 and digits are stored reverse-order.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(53, $$Each list contains up to 50 nodes and node values are between -100 and 100.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(54, $$1 <= n <= length of list, list length <= 30.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(55, $$1 <= len(s) <= 1000, s contains ASCII letters.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(56, $$1 <= len(s) <= 200, contains ASCII characters.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(57, $$0 <= x <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(58, $$-2^31 <= n <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(59, $$0 <= x, y <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(60, $$0 <= n <= 2^31 - 1$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(61, $$1 <= len(nums) <= 10^4, all numbers are in [0, n]$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(62, $$1 <= nums.length <= 10^5, values are in [1, n].$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(63, $$1 <= len(s) <= 10^5, lowercase letters only.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(64, $$1 <= len(text) <= 10^4 and text consists of lowercase English letters.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(65, $$1 <= len(nums) <= 3*10^4 and sorted non-decreasingly.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(66, $$-2^31 <= nums[i] <= 2^31 - 1 and len <= 3*10^4.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(67, $$2 <= len(nums) <= 10^5 and 1 <= nums[i] <= 10^9.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(68, $$Numbers are sorted non-decreasing and length 2..3*10^4.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(69, $$3 <= n <= 3000, -10^5 <= nums[i] <= 10^5.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(70, $$3 <= n <= 3000, -10^5 <= nums[i] <= 10^5.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(71, $$0 <= len(digits) <= 4, digits are 2-9.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(72, $$1 <= n <= 8.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(73, $$Each node value fits in int; max nodes 2000.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(74, $$0 <= n <= 5000 and node values in [-100,100].$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(75, $$1 <= len(nums) <= 5000, all values unique.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(76, $$n <= 5000 and all values distinct.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(77, $$1 <= k <= len(nums), len(nums) <= 10^5.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(78, $$1 <= k <= 10^4, up to 10^4 add operations.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(79, $$1 <= len(nums) <= 1000, values are ints.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(80, $$1 <= len(nums) <= 10^5 and 0 <= k <= 10^5.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(81, $$1 <= len(nums) <= 3*10^4, values within signed 32-bit int.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(82, $$n <= 3*10^4 and exactly one element appears once.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(83, $$1 <= len(nums) <= 5*10^4.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(84, $$length <= 300 and values in {0,1,2}.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(85, $$Grid size m,n up to 300.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(86, $$1 <= m,n <= 200 and chars are X/O.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(87, $$1 <= len(s) <= 10^5 and lowercase letters.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(88, $$1 <= m,n <= 300 and matrix sorted both row/col-wise.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(89, $$1 <= len(s) <= 10^3 and 1 <= k <= len(s)$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(90, $$1 <= n <= 5000, words lengths equal and lowercase.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(91, $$1 <= len(s) <= 10^5 and 1 <= len(t) <= len(s).$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(92, $$1 <= len(s) <= 5 * 10^4 and s contains English letters.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(93, $$1 <= len(nums) <= 10^5 and integers in [-10^9,10^9].$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(94, $$n <= 20000, values can be negative.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(95, $$1 <= target <= 10^9, len(nums) <= 10^5 and nums[i] > 0.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(96, $$1 <= len(s) <= 10^5 and 1 <= k <= 26.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(97, $$1 <= len(nums) <= 10^5 and -10^5 <= nums[i] <= 10^5.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(98, $$1 <= len(nums) <= 2*10^4 and -10 <= nums[i] <= 10.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(99, $$1 <= len(nums) <= 3*10^4 and -30000 <= nums[i] <= 30000.$$);
INSERT INTO problem_constraint (problem_id, problem_constraint) VALUES
(100, $$1 <= len(prices) <= 5000 and 0 <= prices[i] <= 10^3.$$);

-- ============================================
-- SOLUTION DATA 
-- ============================================
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    1,
    $$def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []$$,
    'Use a hash map to track complements in one pass.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    2,
    $$def isPalindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]$$,
    'Normalize the string and compare with its reverse.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    3,
    $$def containsDuplicate(nums: List[int]) -> bool:
    return len(nums) != len(set(nums))$$,
    'A set removes duplicates; compare sizes.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    4,
    $$def productExceptSelf(nums: List[int]) -> List[int]:
    n = len(nums)
    result = [1] * n
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    return result$$,
    'Prefix and suffix products avoid division.',
    'O(n)',
    'O(1) excluding output array'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    5,
    $$def coinChange(coins: List[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return -1 if dp[amount] == amount + 1 else dp[amount]$$,
    'Bottom-up DP builds minimum coins for each amount.',
    'O(n * m)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    6,
    $$def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack$$,
    'Use a stack to validate bracket matching.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    7,
    $$class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def _shift(self) -> None:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self) -> int:
        self._shift()
        return self.out_stack.pop()

    def peek(self) -> int:
        self._shift()
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack$$,
    'Transfer from input to output stack when needed.',
    'O(1) amortized',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    8,
    $$def lengthOfLongestSubstring(s: str) -> int:
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best$$,
    'Sliding window with last-seen indices.',
    'O(n)',
    'O(min(n, alphabet))'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    9,
    $$def minDistance(word1: str, word2: str) -> int:
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]$$,
    'Classic DP on prefixes of both strings.',
    'O(n * m)',
    'O(n * m)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    10,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))$$,
    'Recursive DFS returns maximum depth.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    11,
    $$def maxProfit(prices: List[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit$$,
    'Track minimum price seen so far and calculate profit for each day.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    12,
    $$def isAnagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)$$,
    'Sort both strings and compare. Alternative: use Counter.',
    'O(n log n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    13,
    $$def majorityElement(nums: List[int]) -> int:
    from collections import Counter
    return Counter(nums).most_common(1)[0][0]$$,
    'Use hash map to count frequencies. Boyer-Moore is O(1) space alternative.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    14,
    $$def moveZeroes(nums: List[int]) -> None:
    left = 0
    for right in range(len(nums)):
        if nums[right] != 0:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1$$,
    'Two pointers: left tracks position for next non-zero, right scans array.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    15,
    $$def merge(nums1: List[int], m: int, nums2: List[int], n: int) -> None:
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1$$,
    'Merge from back to avoid overwriting elements in nums1.',
    'O(m + n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    16,
    $$def reverseString(s: List[str]) -> None:
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1$$,
    'Two pointers swap characters from both ends.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    17,
    $$def firstUniqChar(s: str) -> int:
    from collections import Counter
    count = Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1$$,
    'Count all characters, then find first with count 1.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    18,
    $$class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)
    
    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]$$,
    'Maintain parallel stack tracking minimum at each level.',
    'O(1) all operations',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    19,
    $$def plusOne(digits: List[int]) -> List[int]:
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits$$,
    'Handle carry from right to left. If all 9s, prepend 1.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    20,
    $$def removeDuplicates(nums: List[int]) -> int:
    if not nums:
        return 0
    left = 1
    for right in range(1, len(nums)):
        if nums[right] != nums[right - 1]:
            nums[left] = nums[right]
            left += 1
    return left$$,
    'Two pointers: left tracks next unique position.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    21,
    $$def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    return root$$,
    'Recursively swap left and right subtrees.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    22,
    $$def longestCommonPrefix(strs: List[str]) -> str:
    if not strs:
        return ""
    for i in range(len(strs[0])):
        char = strs[0][i]
        for s in strs[1:]:
            if i >= len(s) or s[i] != char:
                return strs[0][:i]
    return strs[0]$$,
    'Compare characters column by column across all strings.',
    'O(S) where S is sum of all characters',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    23,
    $$def pivotIndex(nums: List[int]) -> int:
    total = sum(nums)
    left_sum = 0
    for i, num in enumerate(nums):
        if left_sum == total - left_sum - num:
            return i
        left_sum += num
    return -1$$,
    'Track left sum and compare with right sum at each index.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    24,
    $$def intersect(nums1: List[int], nums2: List[int]) -> List[int]:
    from collections import Counter
    count = Counter(nums1)
    result = []
    for num in nums2:
        if count[num] > 0:
            result.append(num)
            count[num] -= 1
    return result$$,
    'Count elements in first array, then consume from second.',
    'O(m + n)',
    'O(min(m, n))'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    25,
    $$def isSymmetric(root: Optional[TreeNode]) -> bool:
    def mirror(left, right):
        if not left and not right:
            return True
        if not left or not right:
            return False
        return (left.val == right.val and 
                mirror(left.left, right.right) and 
                mirror(left.right, right.left))
    return mirror(root, root) if root else True$$,
    'Recursively check if left subtree mirrors right subtree.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    26,
    $$def rotate(nums: List[int], k: int) -> None:
    k = k % len(nums)
    nums[:] = nums[-k:] + nums[:-k]$$,
    'Slice and concatenate. Alternative: reverse three times.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    27,
    $$def groupAnagrams(strs: List[str]) -> List[List[str]]:
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())$$,
    'Group strings by their sorted character tuple.',
    'O(n * k log k) where k is max string length',
    'O(n * k)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    28,
    $$def rob(nums: List[int]) -> int:
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr$$,
    'DP: at each house, choose max of (skip, rob this + skip last).',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    29,
    $$def maxArea(height: List[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area$$,
    'Two pointers: move pointer at shorter height inward.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    30,
    $$def dailyTemperatures(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    stack = []
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_i = stack.pop()
            result[prev_i] = i - prev_i
        stack.append(i)
    return result$$,
    'Monotonic decreasing stack stores indices of unresolved days.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    31,
    $$def maxSubArray(nums: List[int]) -> int:
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum$$,
    'Kadane algorithm: track current subarray sum, reset if negative.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    32,
    $$def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    if not root:
        return []
    from collections import deque
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result$$,
    'BFS using queue, process each level separately.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    33,
    $$def topKFrequent(nums: List[int], k: int) -> List[int]:
    from collections import Counter
    import heapq
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)$$,
    'Count frequencies, then use heap to find top k.',
    'O(n log k)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    34,
    $$def lengthOfLIS(nums: List[int]) -> int:
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)$$,
    'DP: dp[i] = longest LIS ending at i. O(n log n) with binary search possible.',
    'O(n^2)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    35,
    $$def findPeakElement(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[mid + 1]:
            right = mid
        else:
            left = mid + 1
    return left$$,
    'Binary search: move toward higher neighbor.',
    'O(log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    36,
    $$def characterReplacement(s: str, k: int) -> int:
    from collections import Counter
    count = Counter()
    left = max_count = result = 0
    for right in range(len(s)):
        count[s[right]] += 1
        max_count = max(max_count, count[s[right]])
        if right - left + 1 - max_count > k:
            count[s[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result$$,
    'Sliding window: track most frequent char, shrink if replacements exceed k.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    37,
    $$class MyCircularQueue:
    def __init__(self, k: int):
        self.queue = [0] * k
        self.size = 0
        self.capacity = k
        self.front = 0
    
    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        rear = (self.front + self.size) % self.capacity
        self.queue[rear] = value
        self.size += 1
        return True
    
    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True
    
    def Front(self) -> int:
        return -1 if self.isEmpty() else self.queue[self.front]
    
    def Rear(self) -> int:
        if self.isEmpty():
            return -1
        rear = (self.front + self.size - 1) % self.capacity
        return self.queue[rear]
    
    def isEmpty(self) -> bool:
        return self.size == 0
    
    def isFull(self) -> bool:
        return self.size == self.capacity$$,
    'Use fixed array with front pointer and size tracking.',
    'O(1) all operations',
    'O(k)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    38,
    $$def canJump(nums: List[int]) -> bool:
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + nums[i])
    return True$$,
    'Greedy: track furthest reachable index.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    39,
    $$def isValidBST(root: Optional[TreeNode]) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))
    return validate(root)$$,
    'Recursively validate with min/max bounds for each subtree.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    40,
    $$def decodeString(s: str) -> str:
    stack = []
    for char in s:
        if char != ']':
            stack.append(char)
        else:
            substr = ""
            while stack[-1] != '[':
                substr = stack.pop() + substr
            stack.pop()
            num_str = ""
            while stack and stack[-1].isdigit():
                num_str = stack.pop() + num_str
            stack.append(substr * int(num_str))
    return ''.join(stack)$$,
    'Use stack to handle nested encodings.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    41,
    $$def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == s[i - 1] or p[j - 1] == '.':
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] == s[i - 1] or p[j - 2] == '.':
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
    return dp[m][n]$$,
    'DP matching prefixes. Handle * as zero or more of preceding.',
    'O(m * n)',
    'O(m * n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    42,
    $$def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        partition1 = (left + right) // 2
        partition2 = (m + n + 1) // 2 - partition1
        maxLeft1 = float('-inf') if partition1 == 0 else nums1[partition1 - 1]
        minRight1 = float('inf') if partition1 == m else nums1[partition1]
        maxLeft2 = float('-inf') if partition2 == 0 else nums2[partition2 - 1]
        minRight2 = float('inf') if partition2 == n else nums2[partition2]
        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
            if (m + n) % 2 == 0:
                return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2
            else:
                return max(maxLeft1, maxLeft2)
        elif maxLeft1 > minRight2:
            right = partition1 - 1
        else:
            left = partition1 + 1$$,
    'Binary search on smaller array to find partition.',
    'O(log(min(m, n)))',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    43,
    $$def longestValidParentheses(s: str) -> int:
    stack = [-1]
    max_len = 0
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    return max_len$$,
    'Stack tracks indices. Update length when valid substring found.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    44,
    $$def minWindow(s: str, t: str) -> str:
    from collections import Counter
    need = Counter(t)
    have = {}
    required = len(need)
    formed = 0
    left = 0
    min_len = float('inf')
    min_left = 0
    for right, char in enumerate(s):
        have[char] = have.get(char, 0) + 1
        if char in need and have[char] == need[char]:
            formed += 1
        while formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_left = left
            have[s[left]] -= 1
            if s[left] in need and have[s[left]] < need[s[left]]:
                formed -= 1
            left += 1
    return "" if min_len == float('inf') else s[min_left:min_left + min_len]$$,
    'Sliding window with frequency tracking.',
    'O(m + n)',
    'O(m + n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    45,
    $$def maxPathSum(root: Optional[TreeNode]) -> int:
    max_sum = float('-inf')
    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        path_sum = node.val + left_gain + right_gain
        max_sum = max(max_sum, path_sum)
        return node.val + max(left_gain, right_gain)
    max_gain(root)
    return max_sum$$,
    'Recursively compute max path through each node.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    46,
    $$def largestRectangleArea(heights: List[int]) -> int:
    stack = []
    max_area = 0
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area$$,
    'Monotonic stack to find boundaries for each bar.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    47,
    $$def trap(height: List[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water$$,
    'Two pointers: trap water based on lower max boundary.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    48,
    $$def jump(nums: List[int]) -> int:
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps$$,
    'Greedy BFS: track furthest reach at each jump level.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    49,
    $$def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:
    from collections import deque
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])
    while queue:
        word, level = queue.popleft()
        if word == endWord:
            return level
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word in word_set:
                    word_set.remove(next_word)
                    queue.append((next_word, level + 1))
    return 0$$,
    'BFS on word graph. Try all single-letter transformations.',
    'O(M^2 * N) where M is word length, N is word count',
    'O(M * N)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    50,
    $$def climbStairs(n: int) -> int:
    if n <= 2:
        return max(n, 1)
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b$$,
    'Dynamic programming for each stair depends on previous two.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    51,
    $$def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev$$,
    'Iteratively reverse pointers while traversing once.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    52,
    $$def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    cur = dummy
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        total = v1 + v2 + carry
        carry = total // 10
        cur.next = ListNode(total % 10)
        cur = cur.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next$$,
    'Add digit-wise with carry until both lists and carry are exhausted.',
    'O(n + m)',
    'O(max(n, m))'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    53,
    $$def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    cur = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            cur.next = list1
            list1 = list1.next
        else:
            cur.next = list2
            list2 = list2.next
        cur = cur.next
    cur.next = list1 or list2
    return dummy.next$$,
    'Use a dummy node and attach the smaller node each step.',
    'O(n + m)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    54,
    $$def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    fast = dummy
    slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next$$,
    'Two pointers with fixed gap avoid needing one pass to count length first.',
    'O(L)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    55,
    $$def longestPalindrome(s: str) -> str:
    if not s:
        return ''
    start = end = 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r - 1
    for i in range(len(s)):
        l1, r1 = expand(i, i)
        l2, r2 = expand(i, i + 1)
        for l, r in ((l1, r1), (l2, r2)):
            if r - l > end - start:
                start, end = l, r
    return s[start:end+1]$$,
    'Expand around each center and track the longest bounds.',
    'O(n^2)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    56,
    $$def myAtoi(s: str) -> int:
    s = s.strip()
    sign = 1
    i = 0
    if not s:
        return 0
    if s[0] in '+-':
        sign = -1 if s[0] == '-' else 1
        i = 1
    num = 0
    while i < len(s) and s[i].isdigit():
        num = num * 10 + int(s[i])
        i += 1
    return max(-2**31, min(sign * num, 2**31 - 1))$$,
    'Scan sign and digits once, then clamp to integer bounds.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    57,
    $$def mySqrt(x: int) -> int:
    lo, hi = 0, x
    while lo <= hi:
        mid = (lo + hi) // 2
        sq = mid * mid
        if sq == x:
            return mid
        if sq < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi$$,
    'Binary search first integer whose square is greater than x.',
    'O(log x)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    58,
    $$def isPowerOfFour(n: int) -> bool:
    if n <= 0:
        return False
    while n % 4 == 0:
        n //= 4
    return n == 1$$,
    'Repeatedly divide by 4 and ensure final value is 1.',
    'O(log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    59,
    $$def hammingDistance(x: int, y: int) -> int:
    return bin(x ^ y).count('1')$$,
    'XOR highlights differing positions; count set bits.',
    'O(log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    60,
    $$def hammingWeight(n: int) -> int:
    cnt = 0
    while n:
        cnt += 1
        n &= n - 1
    return cnt$$,
    'Brian Kernighan''s bit trick clears one set bit each loop.',
    'O(number of set bits)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    61,
    $$def missingNumber(nums: list[int]) -> int:
    n = len(nums)
    total = n * (n + 1) // 2
    return total - sum(nums)$$,
    'Expected sum minus actual sum gives the missing value.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    62,
    $$def findDuplicate(nums: list[int]) -> int:
    seen = set()
    for v in nums:
        if v in seen:
            return v
        seen.add(v)
    return -1$$,
    'Track seen values in a hash set and return first repeated.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    63,
    $$def firstUniqChar(s: str) -> int:
    from collections import Counter
    count = Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1$$,
    'Count occurrences then scan to find first with frequency 1.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    64,
    $$def maxNumberOfBalloons(text: str) -> int:
    from collections import Counter
    cnt = Counter(text)
    return min(
        cnt['b'],
        cnt['a'],
        cnt['l'] // 2,
        cnt['o'] // 2,
        cnt['n']
    )$$,
    'Count required letters and divide l/o counts by two because they appear twice in "balloon".',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    65,
    $$def removeDuplicates(nums: list[int]) -> int:
    j = 0
    for v in nums:
        if j < 2 or v != nums[j-1] or v != nums[j-2]:
            nums[j] = v
            j += 1
    return j$$,
    'Use write pointer and allow at most two equal copies of each number.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    66,
    $$def moveZeroesToFront(nums: list[int]) -> None:
    pos = len(nums)-1
    for i in range(len(nums)-1, -1, -1):
        if nums[i] == 0:
            nums.insert(0, nums.pop(i))$$,
    'Shift non-zero elements forward then fill zeros at the front. (Simple list-based implementation.)',
    'O(n^2)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    67,
    $$def maximumDifference(nums: list[int]) -> int:
    minv = nums[0]
    best = -1
    for v in nums[1:]:
        if v > minv:
            best = max(best, v - minv)
        else:
            minv = v
    return best$$,
    'Track the smallest value so far and maximize later differences; return -1 if no increase exists.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    68,
    $$def twoSum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers)-1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l+1, r+1]
        if s < target:
            l += 1
        else:
            r -= 1
    return []$$,
    'Two-pointer move from both ends on sorted input.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    69,
    $$def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums)-2):
        if i>0 and nums[i]==nums[i-1]:
            continue
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                l +=1; r -=1
                while l<r and nums[l]==nums[l-1]: l+=1
                while l<r and nums[r]==nums[r+1]: r-=1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res$$,
    'Sort once, then fix i and two-sum with two pointers.',
    'O(n^2)',
    'O(log n) or O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    70,
    $$def threeSumClosest(nums: list[int], target: int) -> int:
    nums.sort()
    best = nums[0] + nums[1] + nums[2]
    for i in range(len(nums)-2):
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i]+nums[l]+nums[r]
            if abs(s - target) < abs(best - target):
                best = s
            if s < target:
                l += 1
            elif s > target:
                r -= 1
            else:
                return target
    return best$$,
    'Sort then use two pointers for each pivot to minimize distance to target.',
    'O(n^2)',
    'O(log n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    71,
    $$def letterCombinations(digits: str) -> list[str]:
    if not digits:
        return []
    mp = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    res = ['']
    for d in digits:
        nxt = []
        for p in res:
            for c in mp[d]:
                nxt.append(p+c)
        res = nxt
    return res$$,
    'Build combinations by iterative expansion over each digit mapping.',
    'O(4^n)',
    'O(4^n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    72,
    $$def generateParenthesis(n: int) -> list[str]:
    res = []
    def bt(cur, openN, closeN):
        if len(cur) == 2*n:
            res.append(cur); return
        if openN < n:
            bt(cur+'(', openN+1, closeN)
        if closeN < openN:
            bt(cur+')', openN, closeN+1)
    bt('',0,0)
    return res$$,
    'Backtracking with open/close counts ensures only valid strings are built.',
    'O(Catalan(n))',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    73,
    $$def mergeTrees(root1, root2):
    if not root1:
        return root2
    if not root2:
        return root1
    root1.val += root2.val
    root1.left = mergeTrees(root1.left, root2.left)
    root1.right = mergeTrees(root1.right, root2.right)
    return root1$$,
    'DFS recursively merges nodes and reuses existing structure.',
    'O(n + m)',
    'O(n + m)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    74,
    $$def hasPathSum(root, targetSum: int) -> bool:
    if not root:
        return False
    targetSum -= root.val
    if not root.left and not root.right:
        return targetSum == 0
    return hasPathSum(root.left, targetSum) or hasPathSum(root.right, targetSum)$$,
    'Subtract node values on DFS and check at leaf nodes.',
    'O(n)',
    'O(h)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    75,
    $$def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target:
            return m
        if nums[l] <= nums[m]:
            if nums[l] <= target < nums[m]:
                r = m - 1
            else:
                l = m + 1
        else:
            if nums[m] < target <= nums[r]:
                l = m + 1
            else:
                r = m - 1
    return -1$$,
    'Identify the sorted half each iteration and narrow search accordingly.',
    'O(log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    76,
    $$def findMin(nums: list[int]) -> int:
    l, r = 0, len(nums)-1
    while l < r:
        m = (l + r) // 2
        if nums[m] > nums[r]:
            l = m + 1
        else:
            r = m
    return nums[l]$$,
    'Compare mid to right boundary to locate the pivot region.',
    'O(log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    77,
    $$def findKthLargest(nums: list[int], k: int) -> int:
    nums.sort(reverse=True)
    return nums[k-1]$$,
    'Sorting places descending order and direct indexing returns kth largest.',
    'O(n log n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    78,
    $$class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.arr = sorted(nums)
    def add(self, val: int) -> int:
        self.arr.append(val)
        self.arr.sort()
        return self.arr[-self.k]$$,
    'Keep the numbers sorted and read kth from the end.',
    'O(n log n) per add',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    79,
    $$def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    return list(set(nums1) & set(nums2))$$,
    'Use set intersection to capture unique common values.',
    'O(n + m)',
    'O(n + m)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    80,
    $$def containsNearbyDuplicate(nums: list[int], k: int) -> bool:
    seen = {}
    for i, v in enumerate(nums):
        if v in seen and i - seen[v] <= k:
            return True
        seen[v] = i
    return False$$,
    'Track last index per value and compare distance.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    81,
    $$def singleNumber(nums: list[int]) -> int:
    x = 0
    for v in nums:
        x ^= v
    return x$$,
    'XOR of all numbers cancels pairs and leaves unique value.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    82,
    $$def singleNumber(nums: list[int]) -> int:
    ones = twos = 0
    for x in nums:
        ones = (ones ^ x) & ~twos
        twos = (twos ^ x) & ~ones
    return ones$$,
    'Use bitmask DP via two accumulators for counts modulo 3.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    83,
    $$def majorityElement(nums: list[int]) -> list[int]:
    count1 = count2 = 0
    cand1 = cand2 = None
    for v in nums:
        if cand1 == v:
            count1 += 1
        elif cand2 == v:
            count2 += 1
        elif count1 == 0:
            cand1, count1 = v, 1
        elif count2 == 0:
            cand2, count2 = v, 1
        else:
            count1 -= 1
            count2 -= 1
    return [x for x in (cand1, cand2) if nums.count(x) > len(nums)//3]$$,
    'Extend Boyer-Moore to track up to two candidates, then verify.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    84,
    $$def sortColors(nums: list[int]) -> None:
    low = mid = 0
    high = len(nums)-1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[high], nums[mid] = nums[mid], nums[high]
            high -= 1$$,
    'Use Dutch national flag three-way partitioning.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    85,
    $$def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]
    visited = set()
    def dfs(r, c):
        if r<0 or c<0 or r>=m or c>=n or grid[r][c] != '1' or (r,c) in visited:
            return
        visited.add((r,c))
        for dr, dc in dirs:
            dfs(r+dr, c+dc)
    ans = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1' and (i,j) not in visited:
                ans += 1
                dfs(i,j)
    return ans$$,
    'Flood fill each unvisited land cell and count components.',
    'O(m*n)',
    'O(m*n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    86,
    $$def solve(board: list[list[str]]) -> None:
    if not board:
        return
    m, n = len(board), len(board[0])
    def dfs(r,c):
        if r<0 or c<0 or r>=m or c>=n or board[r][c] != 'O':
            return
        board[r][c] = '#'
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            dfs(r+dr,c+dc)
    for i in range(m):
        dfs(i,0); dfs(i,n-1)
    for j in range(n):
        dfs(0,j); dfs(m-1,j)
    for i in range(m):
        for j in range(n):
            board[i][j] = 'O' if board[i][j] == '#' else 'X'$$,
    'Mark border-connected O first, then flip remaining O.',
    'O(m*n)',
    'O(m*n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    87,
    $$def validPalindrome(s: str) -> bool:
    def isPal(t):
        return t == t[::-1]
    l, r = 0, len(s)-1
    while l < r:
        if s[l] != s[r]:
            return isPal(s[l+1:r+1]) or isPal(s[l:r])
        l += 1
        r -= 1
    return True$$,
    'On mismatch, test both skip-left and skip-right choices.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    88,
    $$def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix:
        return False
    m, n = len(matrix), len(matrix[0])
    l, r = 0, m*n - 1
    while l <= r:
        mid = (l + r)//2
        v = matrix[mid//n][mid % n]
        if v == target:
            return True
        if v < target:
            l = mid + 1
        else:
            r = mid - 1
    return False$$,
    'Flatten index space and run binary search on virtual array.',
    'O(log(m*n))',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    89,
    $$def has_repeated_substring_of_length_k(s: str, k: int) -> bool:
    if k > len(s):
        return False
    seen = set()
    for i in range(len(s)-k+1):
        sub = s[i:i+k]
        if sub in seen:
            return True
        seen.add(sub)
    return False$$,
    'Hash every length-k substring and detect repeats.',
    'O(n*k)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    90,
    $$def findLadders(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
    return []$$,
    'Use BFS for shortest distance and DFS for path reconstruction.',
    'O(M^2 * N)',
    'O(M * N)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    91,
    $$def isSubsequence(s: str, t: str) -> bool:
    i = 0
    for ch in t:
        j = s.find(ch, i)
        if j == -1:
            return False
        i = j + 1
    return True$$,
    'Greedily match each character in order.',
    'O(n + m)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    92,
    $$def lengthOfLongestSubstringTwoDistinct(s: str) -> int:
    freq = {}
    l = 0
    ans = 0
    for r, ch in enumerate(s):
        freq[ch] = freq.get(ch, 0) + 1
        while len(freq) > 2:
            left_ch = s[l]
            freq[left_ch] -= 1
            if freq[left_ch] == 0:
                del freq[left_ch]
            l += 1
        ans = max(ans, r - l + 1)
    return ans$$,
    'Sliding window with character counts keeps at most two distinct characters.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    93,
    $$def findLengthOfShortestSubarray(nums: list[int]) -> int:
    l = 0
    n = len(nums)
    while l + 1 < n and nums[l] <= nums[l+1]:
        l += 1
    if l == n-1:
        return 0
    r = n - 1
    while r - 1 >= 0 and nums[r-1] <= nums[r]:
        r -= 1
    ans = min(n - l - 1, r)
    i = 0
    j = r
    while i <= l and j < n:
        if nums[i] <= nums[j]:
            ans = min(ans, j - i - 1)
            i += 1
        else:
            j += 1
    return ans$$,
    'Find longest already-sorted prefix/suffix and bridge with two pointers.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    94,
    $$def subarraySum(nums: list[int], k: int) -> int:
    from collections import defaultdict
    pref = 0
    cnt = defaultdict(int)
    cnt[0] = 1
    ans = 0
    for n in nums:
        pref += n
        ans += cnt[pref - k]
        cnt[pref] += 1
    return ans$$,
    'Prefix sums with hashmap counts how many previous prefixes satisfy sum-k.',
    'O(n)',
    'O(n)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    95,
    $$def minSubArrayLen(target: int, nums: list[int]) -> int:
    l = 0
    s = 0
    ans = float('inf')
    for r, v in enumerate(nums):
        s += v
        while s >= target:
            ans = min(ans, r - l + 1)
            s -= nums[l]
            l += 1
    return 0 if ans == float('inf') else ans$$,
    'Sliding window with positive numbers lets left pointer only move forward.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    96,
    $$def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:
    from collections import defaultdict
    cnt = defaultdict(int)
    l = 0
    ans = 0
    for r, ch in enumerate(s):
        cnt[ch] += 1
        while len(cnt) > k:
            cnt[s[l]] -= 1
            if cnt[s[l]] == 0:
                del cnt[s[l]]
            l += 1
        ans = max(ans, r-l+1)
    return ans$$,
    'Adjust left bound whenever distinct count exceeds k.',
    'O(n)',
    'O(k)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    97,
    $$def checkSubarraySum(nums: list[int], k: int) -> bool:
    if k == 0:
        for i in range(len(nums)-1):
            if nums[i] == 0 and nums[i+1] == 0:
                return True
        return False
    seen = {0: -1}
    pref = 0
    for i, v in enumerate(nums):
        pref += v
        rem = pref % k
        if rem in seen:
            if i - seen[rem] > 1:
                return True
        else:
            seen[rem] = i
    return False$$,
    'Prefix remainders equal implies subarray sum divisible by k.',
    'O(n)',
    'O(k)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    98,
    $$def maxProduct(nums: list[int]) -> int:
    curMax = curMin = ans = nums[0]
    for n in nums[1:]:
        if n < 0:
            curMax, curMin = curMin, curMax
        curMax = max(n, curMax * n)
        curMin = min(n, curMin * n)
        ans = max(ans, curMax)
    return ans$$,
    'Track both max and min products since negatives flip roles.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    99,
    $$def maxSubarraySumCircular(nums: list[int]) -> int:
    total = sum(nums)
    curMax = curMin = 0
    maxSum = -10**9
    minSum = 10**9
    for n in nums:
        curMax = max(n, curMax + n)
        maxSum = max(maxSum, curMax)
        curMin = min(n, curMin + n)
        minSum = min(minSum, curMin)
    if maxSum < 0:
        return maxSum
    return max(maxSum, total - minSum)$$,
    'Use max subarray for linear and circular case via total-minSubarray.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity) VALUES
(
    100,
    $$def maxProfit(prices: list[int]) -> int:
    hold, sold, rest = -10**9, 0, 0
    for p in prices:
        prevSold = sold
        sold = hold + p
        hold = max(hold, rest - p)
        rest = max(rest, prevSold)
    return max(sold, rest)$$,
    'State machine handles hold/sold/rest transitions.',
    'O(n)',
    'O(1)'
)
;
INSERT INTO algorithm (algorithm_name) VALUES
  ('Array'),
  ('String'),
  ('Hash Table'),
  ('Dynamic Programming'),
  ('Two Pointers'),
  ('Stack'),
  ('Queue'),
  ('Sliding Window'),
  ('Tree'),
  ('Greedy'),
  ('Monotonic Stack'),
  ('Heap'),
  ('Binary Search'),
  ('Breadth-First Search')
ON CONFLICT (algorithm_name) DO NOTHING;

INSERT INTO problem_algorithm (problem_id, algorithm_id)
SELECT v.problem_id, a.algorithm_id
FROM (
  VALUES
    (1, 'Hash Table'),
    (2, 'Two Pointers'),
    (3, 'Hash Table'),
    (4, 'Array'),
    (5, 'Dynamic Programming'),
    (6, 'Stack'),
    (7, 'Queue'),
    (8, 'Sliding Window'),
    (9, 'Dynamic Programming'),
    (10, 'Tree'),
    (11, 'Array'),
    (12, 'Hash Table'),
    (13, 'Hash Table'),
    (14, 'Two Pointers'),
    (15, 'Two Pointers'),
    (16, 'Two Pointers'),
    (17, 'Hash Table'),
    (18, 'Stack'),
    (19, 'Array'),
    (20, 'Two Pointers'),
    (21, 'Tree'),
    (22, 'String'),
    (23, 'Array'),
    (24, 'Hash Table'),
    (25, 'Tree'),
    (26, 'Array'),
    (27, 'Hash Table'),
    (28, 'Dynamic Programming'),
    (29, 'Two Pointers'),
    (30, 'Monotonic Stack'),
    (31, 'Dynamic Programming'),
    (32, 'Breadth-First Search'),
    (33, 'Heap'),
    (34, 'Dynamic Programming'),
    (35, 'Binary Search'),
    (36, 'Sliding Window'),
    (37, 'Queue'),
    (38, 'Greedy'),
    (39, 'Tree'),
    (40, 'Stack'),
    (41, 'Dynamic Programming'),
    (42, 'Binary Search'),
    (43, 'Stack'),
    (44, 'Sliding Window'),
    (45, 'Tree'),
    (46, 'Monotonic Stack'),
    (47, 'Two Pointers'),
    (48, 'Greedy'),
    (49, 'Breadth-First Search'),
    (50, 'Sliding Window'),
    (51, 'Stack'),
    (52, 'Hash Table'),
    (53, 'Two Pointers'),
    (54, 'Array'),
    (55, 'Dynamic Programming'),
    (56, 'String'),
    (57, 'Binary Search'),
    (58, 'Binary Search'),
    (59, 'String'),
    (60, 'Hash Table'),
    (61, 'Hash Table'),
    (62, 'Hash Table'),
    (63, 'Hash Table'),
    (64, 'Hash Table'),
    (65, 'Two Pointers'),
    (66, 'Two Pointers'),
    (67, 'Array'),
    (68, 'Hash Table'),
    (69, 'Two Pointers'),
    (70, 'Two Pointers'),
    (71, 'String'),
    (72, 'Stack'),
    (73, 'Tree'),
    (74, 'Tree'),
    (75, 'Binary Search'),
    (76, 'Binary Search'),
    (77, 'Heap'),
    (78, 'Heap'),
    (79, 'Hash Table'),
    (80, 'Hash Table'),
    (81, 'Hash Table'),
    (82, 'Hash Table'),
    (83, 'Hash Table'),
    (84, 'Two Pointers'),
    (85, 'Breadth-First Search'),
    (86, 'Breadth-First Search'),
    (87, 'Two Pointers'),
    (88, 'Binary Search'),
    (89, 'Hash Table'),
    (90, 'Breadth-First Search'),
    (91, 'Two Pointers'),
    (92, 'Sliding Window'),
    (93, 'Greedy'),
    (94, 'Hash Table'),
    (95, 'Sliding Window'),
    (96, 'Sliding Window'),
    (97, 'Sliding Window'),
    (98, 'Dynamic Programming'),
    (99, 'Dynamic Programming'),
    (100, 'Dynamic Programming')
) AS v(problem_id, algorithm_name)
JOIN algorithm a ON a.algorithm_name = v.algorithm_name;

-- ============================================
-- SUBMISSIONS 
-- ============================================
INSERT INTO submission (problem_id, account_number, submitted_code, is_correct, submitted_at) VALUES
    (1, 1, $$def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target-num], i]
        seen[num] = i$$, TRUE, '2025-02-10 10:30:00'),
    (2, 2, $$def isPalindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]$$, TRUE, '2025-02-11 14:08:00'),
    (3, 3, $$def containsDuplicate(nums):
    return len(set(nums)) != len(nums)$$, TRUE, '2025-02-12 09:12:00'),
    (4, 4, $$def productExceptSelf(nums):
    n = len(nums)
    res = [1]*n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n-1,-1,-1):
        res[i] *= right
        right *= nums[i]
    return res$$, TRUE, '2025-02-13 16:18:00'),
    (5, 5, $$def coinChange(coins, amount):
    dp = [amount+1]*(amount+1)
    dp[0] = 0
    for a in range(1, amount+1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a-c])
    return -1 if dp[amount] == amount+1 else dp[amount]$$, TRUE, '2025-02-14 11:55:00'),
    (6, 6, $$def isValid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack$$, TRUE, '2025-02-15 13:17:00'),
    (7, 7, $$class MyQueue:
    def __init__(self):
        self.a = []
        self.b = []
    def push(self, x):
        self.a.append(x)
    def pop(self):
        if not self.b:
            while self.a:
                self.b.append(self.a.pop())
        return self.b.pop()$$, FALSE, '2025-02-16 09:45:00'),
    (8, 8, $$def lengthOfLongestSubstring(s):
    seen = {}
    left = 0
    ans = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        ans = max(ans, right - left + 1)
    return ans$$, TRUE, '2025-02-17 17:25:00'),
    (9, 9, $$def minDistance(a, b):
    n, m = len(a), len(b)
    dp = [[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1):
        dp[i][0] = i
    for j in range(m+1):
        dp[0][j] = j
    for i in range(1, n+1):
        for j in range(1, m+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[n][m]$$, TRUE, '2025-02-18 09:05:00'),
    (10, 10, $$def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))$$, TRUE, '2025-02-19 10:10:00');

-- ============================================
-- STUDY PLAN DATA 
-- ============================================
INSERT INTO study_plan (account_number, plan_name, time_available, created_at, is_accepted) VALUES
    (1, 'DP Essentials', 6, '2025-02-10 12:00:00', TRUE),
    (2, 'String Sprint', 4, '2025-02-11 12:30:00', TRUE),
    (3, 'Hashing Basics', 3, '2025-02-12 12:45:00', TRUE),
    (4, 'Arrays in Depth', 5, '2025-02-13 13:10:00', FALSE),
    (5, 'Stacks & Queues', 4, '2025-02-14 13:20:00', TRUE),
    (6, 'Two Pointers Bootcamp', 3, '2025-02-15 13:35:00', TRUE),
    (7, 'Sliding Window Week', 5, '2025-02-16 13:50:00', FALSE),
    (8, 'Tree Traversals', 5, '2025-02-17 14:05:00', TRUE),
    (9, 'Greedy Warmup', 3, '2025-02-18 14:20:00', TRUE),
    (10, 'Interview Mix', 7, '2025-02-19 14:35:00', FALSE);

INSERT INTO study_plan_problems (plan_id, problem_id, estimate_time_assigned) VALUES
    (1, 5, 25),
    (1, 4, 20),
    (2, 2, 12),
    (3, 3, 8),
    (4, 1, 10),
    (5, 6, 15),
    (6, 2, 12),
    (7, 8, 35),
    (8, 10, 18),
    (9, 4, 20);

-- Removed legacy inserts for dropped tables:
-- study_plan_algorithm, study_plan_difficulty

-- ============================================
-- CHAT QUERY DATA 
-- ============================================
INSERT INTO chat_query (account_number, user_message, ai_response, created_at) VALUES
    (1, 'I have 2 hours today. What should I practice?', 'Let''s focus on two medium DP problems and one easy warmup.', '2025-02-10 09:30:00'),
    (2, 'Give me a quick string problem.', 'Try Valid Palindrome and aim for a linear solution.', '2025-02-11 10:10:00'),
    (3, 'I want to work on hash tables.', 'Start with Contains Duplicate, then Two Sum.', '2025-02-12 08:50:00'),
    (4, 'Can you suggest an array problem?', 'Product of Array Except Self is a great fit.', '2025-02-13 09:20:00'),
    (5, 'Help me with stacks.', 'Valid Parentheses is a solid place to begin.', '2025-02-14 11:00:00'),
    (6, 'I want an easy two pointers exercise.', 'Try a palindrome check with two pointers.', '2025-02-15 12:05:00'),
    (7, 'Any sliding window practice?', 'Longest Substring Without Repeating Characters is perfect.', '2025-02-16 13:15:00'),
    (8, 'I need a hard tree problem.', 'Maximum Depth is a warmup before harder tree problems.', '2025-02-17 14:25:00'),
    (9, 'Give me a greedy warmup.', 'Try picking intervals and sorting by end time.', '2025-02-18 15:35:00'),
    (10, 'Build me a mixed plan.', 'I''ll mix arrays, strings, and DP across the week.', '2025-02-19 16:45:00');

-- ============================================
-- TODO ITEMS 
-- ============================================
INSERT INTO todo_item (account_number, problem_id, plan_id, source, added_at) VALUES
    (1, 5, 1, 'study_plan', '2025-02-10 12:05:00'),
    (1, 4, 1, 'study_plan', '2025-02-10 12:05:00'),
    (2, 2, 2, 'study_plan', '2025-02-11 12:35:00'),
    (3, 3, 3, 'study_plan', '2025-02-12 12:50:00'),
    (4, 1, NULL, 'manual', '2025-02-13 09:25:00'),
    (5, 6, 5, 'study_plan', '2025-02-14 13:25:00'),
    (6, 2, NULL, 'manual', '2025-02-15 12:10:00'),
    (7, 8, 7, 'study_plan', '2025-02-16 13:55:00'),
    (8, 10, 8, 'study_plan', '2025-02-17 14:10:00'),
    (9, 4, 9, 'study_plan', '2025-02-18 14:25:00');

-- ============================================
-- STUDY NOTES 
-- ============================================
INSERT INTO study_note (todo_id, account_number, note_content, created_at, updated_at) VALUES
    (1, 1, 'Focus on dp array initialization and base cases.', '2025-02-10 12:10:00', '2025-02-10 12:10:00'),
    (2, 1, 'Remember prefix and suffix products.', '2025-02-10 12:12:00', '2025-02-10 12:12:00'),
    (3, 2, 'Two pointers after normalization.', '2025-02-11 12:40:00', '2025-02-11 12:40:00'),
    (4, 3, 'Use a set to detect duplicates.', '2025-02-12 12:55:00', '2025-02-12 12:55:00'),
    (5, 4, 'Brute force first, then optimize.', '2025-02-13 09:30:00', '2025-02-13 09:30:00'),
    (6, 5, 'Stack of opening brackets.', '2025-02-14 13:30:00', '2025-02-14 13:30:00'),
    (7, 6, 'Sliding window vs two pointers?', '2025-02-15 12:15:00', '2025-02-15 12:15:00'),
    (8, 7, 'Queue via two stacks: amortized O(1).', '2025-02-16 14:00:00', '2025-02-16 14:00:00'),
    (9, 8, 'Tree depth via DFS recursion.', '2025-02-17 14:15:00', '2025-02-17 14:15:00'),
    (10, 9, 'Revisit greedy strategies next week.', '2025-02-18 14:30:00', '2025-02-18 14:30:00');

-- ============================================
-- DML INTEGRITY ASSERTIONS
-- ============================================
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM problem) <> 100 THEN
        RAISE EXCEPTION 'Expected exactly 100 problems';
    END IF;

    IF (SELECT COUNT(DISTINCT problem_title) FROM problem) <> 100 THEN
        RAISE EXCEPTION 'Problem titles must be unique (expected 100 distinct titles)';
    END IF;

    IF EXISTS (
        SELECT 1 FROM problem
        WHERE problem_description ILIKE '%placeholder%'
    ) THEN
        RAISE EXCEPTION 'Problem descriptions cannot contain placeholder text';
    END IF;
END;
$$;
