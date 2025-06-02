const mongoose = require('mongoose');
const Solution = require('./models/solution');
const User = require('./models/user');
require('dotenv').config();

async function initializeSolutions() {
    try {
        console.log('🔍 Initializing solutions database...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB successfully');

        // Find an admin user to assign as creator
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            // Create a default admin user if none exists
            adminUser = new User({
                username: 'admin',
                email: 'admin@priv.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                department: 'IT',
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Created admin user');
        }

        // Clear existing solutions
        await Solution.deleteMany({});
        console.log('✅ Cleared existing solutions');

        // Create sample solutions
        const solutions = [
            {
                title: 'How to Reset Your Password',
                description: 'Step-by-step guide to reset your password when you cannot log into the system.',
                category: 'Account Management',
                content: `Follow these steps to reset your password:

1. Go to the login page
2. Click on "Forgot Password?" link
3. Enter your email address
4. Check your email for reset instructions
5. Click the reset link in the email
6. Enter your new password (must be at least 8 characters)
7. Confirm your new password
8. Click "Reset Password" button

If you don't receive the email within 5 minutes, check your spam folder. If you still don't receive it, contact IT support.

Note: Password reset links expire after 1 hour for security reasons.`,
                createdBy: adminUser._id,
                views: 45
            },
            {
                title: 'Network Connection Troubleshooting',
                description: 'Common solutions for network connectivity issues including Wi-Fi and ethernet problems.',
                category: 'Network',
                content: `Try these troubleshooting steps in order:

**For Wi-Fi Issues:**
1. Check if Wi-Fi is enabled on your device
2. Restart your Wi-Fi adapter (disable/enable)
3. Forget and reconnect to the network
4. Restart your router/modem
5. Move closer to the router
6. Check for interference from other devices

**For Ethernet Issues:**
1. Check cable connections
2. Try a different ethernet cable
3. Restart network adapter
4. Check network settings
5. Run network diagnostics

**General Steps:**
- Restart your computer
- Check firewall settings
- Update network drivers
- Contact your ISP if issues persist

Most network issues are resolved by restarting your router and reconnecting to the network.`,
                createdBy: adminUser._id,
                views: 32
            },
            {
                title: 'Software Installation Problems',
                description: 'Solutions for common software installation errors and permission issues.',
                category: 'Software',
                content: `Common software installation solutions:

**Permission Errors:**
1. Right-click the installer and select "Run as administrator"
2. Ensure you have admin privileges on your computer
3. Temporarily disable antivirus software
4. Check if the software is blocked by company policy

**Installation Failures:**
1. Check system requirements
2. Ensure sufficient disk space (at least 2GB free)
3. Close all other programs before installing
4. Clear temporary files (%temp% folder)
5. Download installer again (file might be corrupted)

**Post-Installation Issues:**
1. Restart your computer after installation
2. Check for software updates
3. Run the program as administrator
4. Check compatibility settings

If you continue to have issues, contact IT support with the specific error message.`,
                createdBy: adminUser._id,
                views: 28
            },
            {
                title: 'Printer Setup and Troubleshooting',
                description: 'How to connect to office printers and resolve common printing issues.',
                category: 'Hardware',
                content: `Printer setup and troubleshooting guide:

**Adding a Network Printer:**
1. Go to Settings > Devices > Printers & scanners
2. Click "Add a printer or scanner"
3. Select "The printer that I want isn't listed"
4. Choose "Add a printer using a TCP/IP address"
5. Enter the printer's IP address
6. Follow the setup wizard

**Common Printer Issues:**
- **Paper Jams:** Turn off printer, carefully remove paper, check for torn pieces
- **Print Quality:** Clean print heads, replace ink/toner cartridges
- **Driver Issues:** Download latest drivers from manufacturer's website
- **Network Issues:** Check printer's network connection, restart printer

**Office Printer IPs:**
- Main Office Printer: 192.168.1.100
- Color Printer: 192.168.1.101
- Scanner/Copier: 192.168.1.102

For persistent issues, check the printer's display panel for error codes or contact IT support.`,
                createdBy: adminUser._id,
                views: 19
            },
            {
                title: 'Account Lockout Recovery',
                description: 'What to do when your account is locked due to multiple failed login attempts.',
                category: 'Account Management',
                content: `If your account is locked:

**Immediate Steps:**
1. Wait 15 minutes before trying to log in again
2. Ensure you're using the correct username and password
3. Check if Caps Lock is on
4. Try logging in from a different device

**If Still Locked:**
1. Contact your supervisor or IT support
2. Provide your username and employee ID
3. Explain when the lockout occurred
4. Mention any recent password changes

**Prevention:**
- Never share your password with anyone
- Use a password manager to avoid typos
- Change your password every 90 days
- Use strong passwords (mix of letters, numbers, symbols)

**Security Note:**
Accounts are automatically locked after 3 failed login attempts to protect against unauthorized access. This is a security feature, not a system error.

For immediate assistance, call IT support at extension 4357.`,
                createdBy: adminUser._id,
                views: 67
            },
            {
                title: 'General Hardware Troubleshooting',
                description: 'Basic troubleshooting steps for common hardware issues like frozen screens, slow performance, and device malfunctions.',
                category: 'Hardware',
                content: `General hardware troubleshooting steps:

**Computer Performance Issues:**
1. Restart your computer
2. Check available disk space (should be >15% free)
3. Close unnecessary programs
4. Run disk cleanup utility
5. Check for malware
6. Update system drivers

**Frozen/Unresponsive System:**
1. Try Ctrl+Alt+Delete
2. Force restart if necessary (hold power button)
3. Boot in safe mode if issues persist
4. Check for hardware conflicts

**Peripheral Device Issues:**
1. Check all cable connections
2. Try different USB ports
3. Restart the device
4. Update device drivers
5. Test with another computer

**When to Contact IT:**
- Hardware damage or suspected failure
- Persistent performance issues after troubleshooting
- Error messages you don't understand
- Any issues affecting work productivity

Remember: Never attempt to open or repair hardware yourself. Contact IT support for all hardware repairs.`,
                createdBy: adminUser._id,
                views: 41
            }
        ];

        // Create solutions one by one
        const createdSolutions = [];
        for (const solutionData of solutions) {
            const solution = new Solution(solutionData);
            await solution.save();
            createdSolutions.push(solution);
        }
        console.log('✅ Created sample solutions');

        // Verify data
        const solutionCount = await Solution.countDocuments();
        console.log(`\n📊 Solutions Database Statistics:`);
        console.log(`Solutions: ${solutionCount}`);

        console.log('\n✅ Solutions database initialized successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🛑 MongoDB connection closed');
    }
}

initializeSolutions(); 