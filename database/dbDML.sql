-- ============================================
-- DailyBits: AI-Powered Python Practice Platform
-- Sample Data (PostgreSQL)
-- ============================================

\c dailybits;

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

INSERT INTO user_auth (email, password, google_id) VALUES
    ('ma.ruit@northeastern.edu', 'hashed_password_1', NULL),
    ('zhang.shuyi1@husky.neu.edu', 'hashed_password_2', NULL),
    ('student@gmail.com', 'hashed_password_3', NULL),
    ('admin@gmail.com', 'admin_hashed_password', NULL),
    ('test.delete.user@gmail.com', 'test_delete_user_password', NULL),
    ('alex.chen@gmail.com', NULL, 'google-oauth2|10000001'),
    ('maya.patel@gmail.com', 'hashed_password_5', NULL),
    ('jordan.wells@gmail.com', NULL, 'google-oauth2|10000002'),
    ('sofia.garcia@gmail.com', 'hashed_password_7', NULL),
    ('liam.brooks@gmail.com', 'hashed_password_8', NULL),
    ('amira.hassan@gmail.com', NULL, 'google-oauth2|10000003');

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

INSERT INTO token_blacklist (jti, email, expired_at) VALUES
    ('jti_001', 'admin@gmail.com', '2025-02-01 10:00:00'),
    ('jti_002', 'ma.ruit@northeastern.edu', '2025-02-02 09:15:00'),
    ('jti_003', 'zhang.shuyi1@husky.neu.edu', '2025-02-03 12:30:00'),
    ('jti_004', 'student@gmail.com', '2025-02-04 08:45:00'),
    ('jti_005', 'alex.chen@gmail.com', '2025-02-05 18:20:00'),
    ('jti_006', 'maya.patel@gmail.com', '2025-02-06 07:05:00'),
    ('jti_007', 'jordan.wells@gmail.com', '2025-02-07 22:10:00'),
    ('jti_008', 'sofia.garcia@gmail.com', '2025-02-08 11:55:00'),
    ('jti_009', 'liam.brooks@gmail.com', '2025-02-09 13:40:00'),
    ('jti_010', 'amira.hassan@gmail.com', '2025-02-10 16:25:00');

-- ============================================
-- PROBLEM DATA
-- ============================================
INSERT INTO problem (difficulty_level, problem_title, problem_description, starter_code, is_published, estimate_time_baseline) VALUES
(
    'Easy',
    'Two Sum',
    $$Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]$$,
    $$def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),
(
    'Easy',
    'Valid Palindrome',
    $$Return true if a string is a palindrome after removing non-alphanumeric characters and lowercasing.

Example:
Input: s = "A man, a plan, a canal: Panama"
Output: true$$,
    $$def isPalindrome(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Contains Duplicate',
    $$Given an integer array nums, return true if any value appears at least twice.

Example:
Input: nums = [1,2,3,1]
Output: true$$,
    $$def containsDuplicate(nums: List[int]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    8
),
(
    'Medium',
    'Product of Array Except Self',
    $$Return an array answer such that answer[i] is the product of all the elements of nums except nums[i].

Example:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]$$,
    $$def productExceptSelf(nums: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Coin Change',
    $$Return the fewest number of coins needed to make up a given amount, or -1 if impossible.

Example:
Input: coins = [1,2,5], amount = 11
Output: 3$$,
    $$def coinChange(coins: List[int], amount: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Valid Parentheses',
    $$Determine if the input string has valid matching brackets.

Example:
Input: s = "()[]{}"
Output: true$$,
    $$def isValid(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Medium',
    'Queue Using Stacks',
    $$Implement a FIFO queue using only two stacks.

Example:
Input: ["MyQueue","push","push","peek","pop","empty"], [[],[1],[2],[],[],[]]
Output: [null,null,null,1,1,false]$$,
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
    $$Find the length of the longest substring without repeating characters.

Example:
Input: s = "abcabcbb"
Output: 3$$,
    $$def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    35
),
(
    'Hard',
    'Edit Distance',
    $$Return the minimum number of operations required to convert one word to another.

Example:
Input: word1 = "horse", word2 = "ros"
Output: 3$$,
    $$def minDistance(word1: str, word2: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Maximum Depth of Binary Tree',
    $$Given the root of a binary tree, return its maximum depth.

Example:
Input: root = [3,9,20,null,null,15,7]
Output: 3$$,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
),
(
    'Easy',
    'Best Time to Buy and Sell Stock',
    $$You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.

Example:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.$$,
    $$def maxProfit(prices: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Easy',
    'Valid Anagram',
    $$Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word.

Example:
Input: s = "anagram", t = "nagaram"
Output: true$$,
    $$def isAnagram(s: str, t: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    10
),
(
    'Easy',
    'Majority Element',
    $$Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.

Example:
Input: nums = [3,2,3]
Output: 3$$,
    $$def majorityElement(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Move Zeroes',
    $$Given an integer array nums, move all 0's to the end while maintaining the relative order of the non-zero elements. Note that you must do this in-place.

Example:
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]$$,
    $$def moveZeroes(nums: List[int]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    10
),
(
    'Easy',
    'Merge Sorted Array',
    $$You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n. Merge nums2 into nums1 as one sorted array.

Example:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]$$,
    $$def merge(nums1: List[int], m: int, nums2: List[int], n: int) -> None:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Easy',
    'Reverse String',
    $$Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]$$,
    $$def reverseString(s: List[str]) -> None:
    # Write your code here
    pass$$,
    TRUE,
    8
),
(
    'Easy',
    'First Unique Character',
    $$Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.

Example:
Input: s = "leetcode"
Output: 0$$,
    $$def firstUniqChar(s: str) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Min Stack',
    $$Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Example:
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]$$,
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
    $$You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array of digits.

Example:
Input: digits = [1,2,3]
Output: [1,2,4]$$,
    $$def plusOne(digits: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),
(
    'Easy',
    'Remove Duplicates from Sorted Array',
    $$Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.

Example:
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]$$,
    $$def removeDuplicates(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Invert Binary Tree',
    $$Given the root of a binary tree, invert the tree, and return its root.

Example:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]$$,
    $$def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Easy',
    'Longest Common Prefix',
    $$Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.

Example:
Input: strs = ["flower","flow","flight"]
Output: "fl"$$,
    $$def longestCommonPrefix(strs: List[str]) -> str:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Easy',
    'Find Pivot Index',
    $$Given an array of integers nums, calculate the pivot index of this array. The pivot index is where the sum of all numbers to the left equals the sum of all numbers to the right.

Example:
Input: nums = [1,7,3,6,5,6]
Output: 3$$,
    $$def pivotIndex(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Easy',
    'Intersection of Two Arrays II',
    $$Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays.

Example:
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2,2]$$,
    $$def intersect(nums1: List[int], nums2: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Symmetric Tree',
    $$Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

Example:
Input: root = [1,2,2,3,4,4,3]
Output: true$$,
    $$def isSymmetric(root: Optional[TreeNode]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    18
),
(
    'Medium',
    'Rotate Array',
    $$Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.

Example:
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]$$,
    $$def rotate(nums: List[int], k: int) -> None:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Group Anagrams',
    $$Given an array of strings strs, group the anagrams together. You can return the answer in any order.

Example:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]$$,
    $$def groupAnagrams(strs: List[str]) -> List[List[str]]:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'House Robber',
    $$You are a professional robber. Each house has a certain amount of money. Adjacent houses have security systems connected. Determine the maximum amount you can rob tonight without alerting the police.

Example:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.$$,
    $$def rob(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Container With Most Water',
    $$You are given an integer array height. Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.

Example:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49$$,
    $$def maxArea(height: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Daily Temperatures',
    $$Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.

Example:
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]$$,
    $$def dailyTemperatures(temperatures: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Maximum Subarray',
    $$Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.$$,
    $$def maxSubArray(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Binary Tree Level Order Traversal',
    $$Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

Example:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]$$,
    $$def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Top K Frequent Elements',
    $$Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Example:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]$$,
    $$def topKFrequent(nums: List[int], k: int) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Longest Increasing Subsequence',
    $$Given an integer array nums, return the length of the longest strictly increasing subsequence.

Example:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.$$,
    $$def lengthOfLIS(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    30
),
(
    'Medium',
    'Find Peak Element',
    $$A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index.

Example:
Input: nums = [1,2,3,1]
Output: 2
Explanation: 3 is a peak element.$$,
    $$def findPeakElement(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Longest Repeating Character Replacement',
    $$You are given a string s and an integer k. You can choose any character and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get.

Example:
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with two 'B's or vice versa.$$,
    $$def characterReplacement(s: str, k: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    30
),
(
    'Medium',
    'Design Circular Queue',
    $$Design your implementation of the circular queue. The circular queue is a linear data structure in which operations are performed based on FIFO principle.

Example:
Input: ["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]
Output: [null, true, true, true, false, 3, true, true, true, 4]$$,
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
    $$You are given an integer array nums. You are initially positioned at the array's first index, and each element represents your maximum jump length. Return true if you can reach the last index.

Example:
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.$$,
    $$def canJump(nums: List[int]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Validate Binary Search Tree',
    $$Given the root of a binary tree, determine if it is a valid binary search tree (BST).

Example:
Input: root = [2,1,3]
Output: true$$,
    $$def isValidBST(root: Optional[TreeNode]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Decode String',
    $$Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is repeated exactly k times.

Example:
Input: s = "3[a]2[bc]"
Output: "aaabcbc"$$,
    $$def decodeString(s: str) -> str:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Hard',
    'Regular Expression Matching',
    $$Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.

Example:
Input: s = "aa", p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".$$,
    $$def isMatch(s: str, p: str) -> bool:
    # Write your code here
    pass$$,
    FALSE,
    45
),
(
    'Hard',
    'Median of Two Sorted Arrays',
    $$Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

Example:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.$$,
    $$def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Longest Valid Parentheses',
    $$Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.

Example:
Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".$$,
    $$def longestValidParentheses(s: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Minimum Window Substring',
    $$Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.

Example:
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.$$,
    $$def minWindow(s: str, t: str) -> str:
    # Write your code here
    pass$$,
    FALSE,
    45
),
(
    'Hard',
    'Binary Tree Maximum Path Sum',
    $$A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. The path sum is the sum of the node values. Return the maximum path sum of any non-empty path.

Example:
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.$$,
    $$def maxPathSum(root: Optional[TreeNode]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Largest Rectangle in Histogram',
    $$Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

Example:
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The largest rectangle has area = 10 (heights 5 and 6).$$,
    $$def largestRectangleArea(heights: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    45
),
(
    'Hard',
    'Trapping Rain Water',
    $$Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The elevation map traps 6 units of rain water.$$,
    $$def trap(height: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Jump Game II',
    $$You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Return the minimum number of jumps to reach nums[n - 1].

Example:
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.$$,
    $$def jump(nums: List[int]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    35
),
(
    'Hard',
    'Word Ladder',
    $$A transformation sequence from word beginWord to word endWord is a sequence where adjacent words differ by a single letter. Given two words and a word list, find the length of shortest transformation sequence, or 0 if none exists.

Example:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: "hit" -> "hot" -> "dot" -> "dog" -> "cog"$$,
    $$def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:
    # Write your code here
    pass$$,
    FALSE,
    45
),
(
    'Hard',
    'Substring with Concatenation of All Words',
    $$You are given a string s and an array of strings words of the same length. Return all starting indices of substring(s) in s that is a concatenation of each word in words exactly once, in any order.

Example:
Input: s = "barfoothefoobarman", words = ["foo","bar"]
Output: [0,9]
Explanation: Substrings starting at index 0 and 9 are "barfoo" and "foobar" respectively.$$,
    $$def findSubstring(s: str, words: List[str]) -> List[int]:
    # Write your code here
    pass$$,
    FALSE,
    50
);

-- ============================================
-- SOLUTION DATA 
-- ============================================
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity, is_published) VALUES
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
    'O(n)',
    TRUE
),
(
    2,
    $$def isPalindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]$$,
    'Normalize the string and compare with its reverse.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    3,
    $$def containsDuplicate(nums: List[int]) -> bool:
    return len(nums) != len(set(nums))$$,
    'A set removes duplicates; compare sizes.',
    'O(n)',
    'O(n)',
    TRUE
),
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
    'O(1) excluding output array',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(n)',
    FALSE
),
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
    'O(min(n, alphabet))',
    FALSE
),
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
    'O(n * m)',
    FALSE
),
(
    10,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))$$,
    'Recursive DFS returns maximum depth.',
    'O(n)',
    'O(h)',
    TRUE
),
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
    'O(1)',
    TRUE
),
(
    12,
    $$def isAnagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)$$,
    'Sort both strings and compare. Alternative: use Counter.',
    'O(n log n)',
    'O(n)',
    TRUE
),
(
    13,
    $$def majorityElement(nums: List[int]) -> int:
    from collections import Counter
    return Counter(nums).most_common(1)[0][0]$$,
    'Use hash map to count frequencies. Boyer-Moore is O(1) space alternative.',
    'O(n)',
    'O(n)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(h)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(min(m, n))',
    TRUE
),
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
    'O(h)',
    TRUE
),
(
    26,
    $$def rotate(nums: List[int], k: int) -> None:
    k = k % len(nums)
    nums[:] = nums[-k:] + nums[:-k]$$,
    'Slice and concatenate. Alternative: reverse three times.',
    'O(n)',
    'O(n)',
    TRUE
),
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
    'O(n * k)',
    TRUE
),
(
    28,
    $$def rob(nums: List[int]) -> int:
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr$$,
    'DP: at each house, choose max of (skip, rob this + skip last).',
    'O(n)',
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(n)',
    TRUE
),
(
    33,
    $$def topKFrequent(nums: List[int], k: int) -> List[int]:
    from collections import Counter
    import heapq
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)$$,
    'Count frequencies, then use heap to find top k.',
    'O(n log k)',
    'O(n)',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(k)',
    TRUE
),
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
    'O(1)',
    TRUE
),
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
    'O(h)',
    TRUE
),
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
    'O(n)',
    TRUE
),
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
    'O(m * n)',
    FALSE
),
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
    'O(1)',
    FALSE
),
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
    'O(n)',
    FALSE
),
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
    'O(m + n)',
    FALSE
),
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
    'O(h)',
    FALSE
),
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
    'O(n)',
    FALSE
),
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
    'O(1)',
    FALSE
),
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
    'O(1)',
    FALSE
),
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
    'O(M * N)',
    FALSE
),
(
    50,
    $$def findSubstring(s: str, words: List[str]) -> List[int]:
    from collections import Counter
    if not s or not words:
        return []
    word_len = len(words[0])
    word_count = len(words)
    total_len = word_len * word_count
    word_freq = Counter(words)
    result = []
    for i in range(len(s) - total_len + 1):
        seen = Counter()
        j = 0
        while j < word_count:
            word_start = i + j * word_len
            word = s[word_start:word_start + word_len]
            if word not in word_freq:
                break
            seen[word] += 1
            if seen[word] > word_freq[word]:
                break
            j += 1
        if j == word_count:
            result.append(i)
    return result$$,
    'Sliding window with word-level matching and frequency check.',
    'O((n - m*k) * m) where m is word length, k is word count',
    'O(k)',
    FALSE
);

-- ============================================
-- ALGORITHM TAGS 
-- ============================================
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
    ('Breadth-First Search');

INSERT INTO problem_algorithm (problem_id, algorithm_id) VALUES
    (1, 3),
    (2, 5),
    (3, 3),
    (4, 1),
    (5, 4),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 4),
    (10, 9),
    (11, 1),
    (12, 3),
    (13, 3),
    (14, 5),
    (15, 5),
    (16, 5),
    (17, 3),
    (18, 6),
    (19, 1),
    (20, 5),
    (21, 9),
    (22, 2),
    (23, 1),
    (24, 3),
    (25, 9),
    (26, 1),
    (27, 3),
    (28, 4),
    (29, 5),
    (30, 11),
    (31, 4),
    (32, 15),
    (33, 12),
    (34, 4),
    (35, 14),
    (36, 8),
    (37, 7),
    (38, 10),
    (39, 9),
    (40, 6),
    (41, 4),
    (42, 14),
    (43, 6),
    (44, 8),
    (45, 9),
    (46, 11),
    (47, 5),
    (48, 10),
    (49, 15),
    (50, 8);

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

INSERT INTO study_plan_algorithm (plan_id, algorithm_id) VALUES
    (1, 4),
    (2, 2),
    (3, 3),
    (4, 1),
    (5, 6),
    (6, 5),
    (7, 8),
    (8, 9),
    (9, 10),
    (10, 1);

INSERT INTO study_plan_difficulty (plan_id, difficulty_level) VALUES
    (1, 'Medium'),
    (2, 'Easy'),
    (3, 'Easy'),
    (4, 'Medium'),
    (5, 'Medium'),
    (6, 'Easy'),
    (7, 'Hard'),
    (8, 'Hard'),
    (9, 'Easy'),
    (10, 'Medium');

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
