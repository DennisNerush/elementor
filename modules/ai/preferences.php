<?php
namespace Elementor\Modules\Ai;

use Elementor\User;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Preferences {

	const ENABLE_AI = 'elementor_enable_ai';

	/**
	 * Register actions and hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'profile_personal_options', function ( \WP_User $user ) {
			$this->add_personal_options_settings( $user );
		} );

		add_action( 'personal_options_update', function ( $user_id ) {
			$this->update_personal_options_settings( $user_id );
		} );
	}



	/**
	 * Determine if AI features are enabled for a user.
	 *
	 * @param int $user_id - User ID.
	 *
	 * @return bool
	 */
	public static function is_ai_enabled( $user_id ) {
		return ! ! User::get_user_option_with_default( static::ENABLE_AI, $user_id, true );
	}

	/**
	 * Add settings to the "Personal Options".
	 *
	 * @param \WP_User $user - User object.
	 *
	 * @return void
	 */
	protected function add_personal_options_settings( \WP_User $user ) {
		if ( ! $this->has_permissions_to_edit_user( $user->ID ) ) {
			return;
		}

		$ai_option_name = static::ENABLE_AI;
		$ai_value = User::get_user_option_with_default( $ai_option_name, $user->ID, '1' );
		?>
		<h2><?php echo esc_html__( 'Elementor - AI', 'elementor' ); ?></h2>
		<table class="form-table" role="presentation">
			<tr>
				<th>
					<label for="<?php echo esc_attr( $ai_option_name ); ?>">
						<?php echo esc_html__( 'Status', 'elementor' ); ?>
					</label>
				</th>
				<td>
					<label for="<?php echo esc_attr( $ai_option_name ); ?>">
						<input name="<?php echo esc_attr( $ai_option_name ); ?>" id="<?php echo esc_attr( $ai_option_name ); ?>" type="checkbox" value="1"<?php checked( '1', $ai_value ); ?> />
						<?php echo esc_html__( 'Enable Elementor AI functionality', 'elementor' ); ?>
					</label>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Save the settings in the "Personal Options".
	 *
	 * @param int $user_id - User ID.
	 *
	 * @return void
	 */
	protected function update_personal_options_settings( $user_id ) {

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce already verified in `wp_verify_nonce`.
		$wpnonce = Utils::get_super_global_value( $_POST, '_wpnonce' );
		if ( ! wp_verify_nonce( $wpnonce, 'update-user_' . $user_id ) ) {
			return;
		}

		if ( ! $this->has_permissions_to_edit_user( $user_id ) ) {
			return;
		}
		
		$ai_option_name = static::ENABLE_AI;
		$ai_value = empty( $_POST[ $ai_option_name ] ) ? '0' : '1';

		update_user_option( $user_id, $ai_option_name, sanitize_text_field( $ai_value ) );
	}

	/**
	 * Determine if the current user has permission to view/change preferences of a user.
	 *
	 * @param int $user_id
	 *
	 * @return bool
	 */
	protected function has_permissions_to_edit_user( $user_id ) {
		return (
			current_user_can( 'edit_user', $user_id )
		);
	}
}
