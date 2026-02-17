-- ============================================
-- DailyBits: AI-Powered Python Practice Platform
-- Sample Data (PostgreSQL)
-- ============================================

\c dailybits;

-- ============================================
-- USER DATA
-- ============================================
INSERT INTO user_profile VALUES 
    ('ma.ruit@northeastern.edu', 'Elly', 'Ma'),
    ('zhang.shuyi1@husky.neu.edu', 'Susie', 'Zhang'),
    ('student@gmail.com', 'Northeastern', 'Student'),
    ('admin@gmail.com', 'Admin', 'User');

INSERT INTO user_auth VALUES
    ('ma.ruit@northeastern.edu', 'hashed_password_1'),
    ('zhang.shuyi1@husky.neu.edu', 'hashed_password_2'),
    ('student@gmail.com', 'hashed_password_3'),
    ('admin@gmail.com', 'admin_hashed_password');

INSERT INTO account (email, register_date, student_flag, admin_flag) VALUES 
    ('ma.ruit@northeastern.edu', '2025-01-15', TRUE, FALSE),
    ('zhang.shuyi1@husky.neu.edu', '2025-01-20', TRUE, FALSE),
    ('admin@gmail.com', '2025-01-01', FALSE, TRUE),
    ('student@gmail.com', '2025-02-10', TRUE, FALSE);

-- ============================================
-- TAG DATA
-- ============================================
INSERT INTO difficulty_tag (difficulty_level) VALUES 
    ('Easy'), 
    ('Medium'), 
    ('Hard');

INSERT INTO concept_tag (concept_name) VALUES 
    ('Array'),
    ('String'),
    ('Hash Table'),
    ('Dynamic Programming'),
    ('Two Pointers'),
    ('Sorting'),
    ('Binary Search'),
    ('Stack'),
    ('Queue'),
    ('Linked List'),
    ('Tree'),
    ('Graph'),
    ('Greedy'),
    ('Backtracking');

-- Create tags (difficulty + concept combinations)
INSERT INTO tag (difficulty_id, concept_id) VALUES 
    -- Easy problems
    (1, 1),  -- Easy Array
    (1, 2),  -- Easy String
    (1, 3),  -- Easy Hash Table
    (1, 5),  -- Easy Two Pointers
    -- Medium problems
    (2, 1),  -- Medium Array
    (2, 4),  -- Medium Dynamic Programming
    (2, 8),  -- Medium Stack
    (2, 10), -- Medium Linked List
    (2, 13), -- Medium Greedy
    -- Hard problems
    (3, 4),  -- Hard Dynamic Programming
    (3, 11), -- Hard Tree
    (3, 12), -- Hard Graph
    (3, 14); -- Hard Backtracking

-- ============================================
-- PROBLEM DATA
-- ============================================
INSERT INTO problem (tag_id, problem_title, problem_description, function_signature, starter_code, review_status, solution_id) VALUES 
(
    1, -- Easy Array
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    'def twoSum(nums: List[int], target: int) -> List[int]:',
    'def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass',
    TRUE,
    1
),
(
    2, -- Easy String
    'Valid Palindrome',
    'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.

Example:
Input: s = "A man, a plan, a canal: Panama"
Output: true',
    'def isPalindrome(s: str) -> bool:',
    'def isPalindrome(s: str) -> bool:
    # Write your code here
    pass',
    TRUE,
    2
),
(
    3, -- Easy Hash Table
    'Contains Duplicate',
    'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example:
Input: nums = [1,2,3,1]
Output: true',
    'def containsDuplicate(nums: List[int]) -> bool:',
    'def containsDuplicate(nums: List[int]) -> bool:
    # Write your code here
    pass',
    TRUE,
    3
),
(
    6, -- Medium Array
    'Product of Array Except Self',
    'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

You must write an algorithm that runs in O(n) time and without using the division operation.

Example:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]',
    'def productExceptSelf(nums: List[int]) -> List[int]:',
    'def productExceptSelf(nums: List[int]) -> List[int]:
    # Write your code here
    pass',
    TRUE,
    4
),
(
    7, -- Medium DP
    'Coin Change',
    'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.

Example:
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1',
    'def coinChange(coins: List[int], amount: int) -> int:',
    'def coinChange(coins: List[int], amount: int) -> int:
    # Write your code here
    pass',
    FALSE,
    NULL
),
(
    11, -- Hard DP
    'Edit Distance',
    'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations:
- Insert a character
- Delete a character
- Replace a character

Example:
Input: word1 = "horse", word2 = "ros"
Output: 3',
    'def minDistance(word1: str, word2: str) -> int:',
    'def minDistance(word1: str, word2: str) -> int:
    # Write your code here
    pass',
    FALSE,
    NULL
);

-- ============================================
-- SOLUTION DATA
-- ============================================
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity, review_status) VALUES 
(
    1,
    'def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []',
    'Use a hash map to store each number and its index as we iterate. For each number, check if its complement (target - num) exists in the hash map. If found, return the indices.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    2,
    'def isPalindrome(s: str) -> bool:
    # Clean string: keep only alphanumeric, convert to lowercase
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    # Check if it reads the same forwards and backwards
    return cleaned == cleaned[::-1]',
    'First, filter out non-alphanumeric characters and convert to lowercase. Then check if the cleaned string equals its reverse.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    3,
    'def containsDuplicate(nums: List[int]) -> bool:
    return len(nums) != len(set(nums))',
    'Convert the list to a set to remove duplicates. If the lengths differ, there were duplicates.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    4,
    'def productExceptSelf(nums: List[int]) -> List[int]:
    n = len(nums)
    result = [1] * n
    
    # Left pass: result[i] contains product of all elements to the left
    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]
    
    # Right pass: multiply by product of all elements to the right
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    
    return result',
    'Use two passes: first calculate products from left, then multiply by products from right. This avoids division and achieves O(n) time.',
    'O(n)',
    'O(1) excluding output array',
    TRUE
);

-- ============================================
-- SUBMISSION & ATTEMPT DATA
-- ============================================
INSERT INTO submission (problem_id, account_number, submitted_code, is_correct, time_start, time_end) VALUES 
(
    1, 1,
    'def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]',
    FALSE,
    '2025-02-10 10:00:00',
    '2025-02-10 10:15:00'
),
(
    1, 1,
    'def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target-num], i]
        seen[num] = i',
    TRUE,
    '2025-02-10 10:20:00',
    '2025-02-10 10:30:00'
),
(
    2, 1,
    'def isPalindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]',
    TRUE,
    '2025-02-11 14:00:00',
    '2025-02-11 14:10:00'
);

INSERT INTO attempt (problem_id, account_number, attempt_number, is_submitted, submission_id) VALUES 
    (1, 1, 1, TRUE, 1),
    (1, 1, 2, TRUE, 2),
    (2, 1, 1, TRUE, 3);

-- ============================================
-- PROGRESS DATA
-- ============================================
INSERT INTO user_progress (account_number, total_problems_attempted, total_problems_solved) VALUES 
    (1, 2, 2),
    (2, 0, 0),
    (3, 0, 0);

-- ============================================
-- LLM DATA
-- ============================================
INSERT INTO llm (model_name) VALUES 
    ('Gemini-1.5-Pro'),
    ('Gemini-1.5-Flash'),
    ('GPT-4'),
    ('Claude-3');

-- ============================================
-- STUDY PLAN DATA
-- ============================================
INSERT INTO study_plan (account_number, model_id, plan_name, focus_area, time_available, difficulty_preference) VALUES 
(
    1,
    1,
    'Dynamic Programming Mastery',
    'Dynamic Programming',
    15,
    'Medium'
);

INSERT INTO study_plan_problems (plan_id, problem_id, day_number) VALUES 
    (1, 1, 1),
    (1, 2, 1),
    (1, 4, 2);

-- ============================================
-- CHAT QUERY DATA
-- ============================================
INSERT INTO chat_query (account_number, model_id, user_message, ai_response) VALUES 
(
    1,
    1,
    'I want to practice dynamic programming problems for 3 hours today',
    'Great! I''ve created a study plan with 3 dynamic programming problems that should take about 3 hours total. Let''s start with...'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment to verify data insertion
-- SELECT * FROM account;
-- SELECT * FROM problem;
-- SELECT * FROM solution;
-- SELECT * FROM user_progress_summary;